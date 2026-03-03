package com.nigus.card_service.service;

import com.nigus.card_service.client.AccountClient;
import com.nigus.card_service.dto.*;
import com.nigus.card_service.entity.*;
import com.nigus.card_service.repository.CardRepository;
import com.nigus.card_service.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import com.nigus.card_service.exception.CardNotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final AccountClient accountClient;  // ← add this field

    // 🔥 Create card (MOST IMPORTANT METHOD)
    public CardResponse createCard(CardCreateRequest request) {

        // Check if the current logged-in user owns this account
        checkAccountOwnership(request.getAccountId());

        String rawNumber = CardNumberGenerator.generate();

        Card card = Card.builder()
                .accountId(request.getAccountId())
                .cardHolderName(request.getCardHolderName())
                .category(request.getCategory())
                .cardNumberHash(HashUtil.hash(rawNumber))
                .maskedCardNumber(MaskUtil.maskCardNumber(rawNumber))
                .cvvHash(HashUtil.hash(request.getCvv()))
                .pinHash(HashUtil.hash(request.getPin()))
                .status(CardStatus.ACTIVE)
                .expirationDate(LocalDate.now().plusYears(3))
                .spendingLimit(request.getSpendingLimit())
                .createdAt(LocalDateTime.now())
                .build();

        Card saved = cardRepository.save(card);

        return mapToResponse(saved);
    }

    public List<CardResponse> getCards(Long accountId) {
        // Optional: protect list too (uncomment if you want strict ownership)
        // checkAccountOwnership(accountId);
        checkAccountOwnership(accountId);
        return cardRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

public void freeze(Long cardId) {
    Card card = get(cardId);
    checkAccountOwnership(card.getAccountId());

    if (card.getStatus() == CardStatus.BLOCKED) {
        throw new IllegalStateException("Blocked cards cannot be frozen. Please unblock first.");
    }
    if (card.getStatus() == CardStatus.FROZEN) {
        throw new IllegalStateException("Card is already frozen.");
    }

    card.setStatus(CardStatus.FROZEN);
    cardRepository.save(card);
}

    public void block(Long cardId) {
        Card card = get(cardId);

        // Check ownership before allowing block
        checkAccountOwnership(card.getAccountId());

        card.setStatus(CardStatus.BLOCKED);
        cardRepository.save(card);
    }

public void changePin(ChangePinRequest request) {
    Card card = get(request.getCardId());
    checkAccountOwnership(card.getAccountId());

    // Optional feature 1: Block PIN change if card is frozen or blocked
    if (card.getStatus() == CardStatus.FROZEN || card.getStatus() == CardStatus.BLOCKED) {
        throw new IllegalStateException(
            "Cannot change PIN on a frozen or blocked card. Please reactivate the card first."
        );
    }

    // Verify old PIN
    boolean pinCorrect = HashUtil.matches(request.getOldPin(), card.getPinHash());

    if (pinCorrect) {
        // Success: reset failed attempts counter
        card.setFailedPinAttempts(0);
        card.setPinHash(HashUtil.hash(request.getNewPin()));
        cardRepository.save(card);
    } else {
        // Wrong PIN: increment failed attempts
        int newAttempts = card.getFailedPinAttempts() + 1;
        card.setFailedPinAttempts(newAttempts);

        // Optional feature 2: Auto-block after 3 failed attempts
        if (newAttempts >= 3) {
            card.setStatus(CardStatus.BLOCKED);
            card.setFailedPinAttempts(0);  // reset counter after block
            cardRepository.save(card);
            throw new IllegalStateException(
                "Too many incorrect PIN attempts. Card has been blocked. Contact support."
            );
        }

        cardRepository.save(card);
        int remaining = 3 - newAttempts;
        throw new IllegalArgumentException(
            "Incorrect current PIN. " + remaining + " attempts remaining."
        );
    }
}

    public void setLimit(SpendingLimitRequest request) {
        Card card = get(request.getCardId());

        // Check ownership before allowing limit change
        checkAccountOwnership(card.getAccountId());

        card.setSpendingLimit(request.getSpendingLimit());
        cardRepository.save(card);
    }

    // Helper method: get the current user's ID from JWT token
    private String getCurrentUserId() {
       /* var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof Jwt jwt) {
            return jwt.getSubject();
        }

        throw new IllegalStateException("Principal is not a JWT");*/
        return "test-user-123";
    }

    // Helper method: check if current user owns this account
    private void checkAccountOwnership(Long accountId) {
        String userIdFromToken = getCurrentUserId();

        // === FAKE CHECK FOR NOW (replace later with real call) ===
        // For testing: pretend accountId must match userId (as string)
        // In real app: call account-service via Feign: "does account X belong to user Y?"
        boolean isOwner = true;//accountClient.doesAccountBelongToUser(accountId, userIdFromToken);

        if (!isOwner) {
            throw new AccessDeniedException("This account does not belong to you");
        }
    }

    private Card get(Long id) {
        return cardRepository.findById(id)
                .orElseThrow(() -> new CardNotFoundException(id));
    }

    private CardResponse mapToResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .accountId(card.getAccountId())
                .maskedCardNumber(card.getMaskedCardNumber())
                .cardHolderName(card.getCardHolderName())
                .status(card.getStatus().name())
                .category(card.getCategory())
                .expirationDate(card.getExpirationDate())
                .spendingLimit(card.getSpendingLimit())
                .build();
    }
    public String getCvv(Long cardId) {
        Card card = get(cardId);
        checkAccountOwnership(card.getAccountId());// your existing get method that throws if not found

        // Security: only allow viewing CVV on active cards
        if (card.getStatus() != CardStatus.ACTIVE) {
            throw new IllegalStateException("Cannot view CVV on a non-active card (frozen or blocked)");
        }

        // Check ownership (same as other actions)
        checkAccountOwnership(card.getAccountId());

        // Return the decrypted CVV
        // Assuming you have a decrypt method in HashUtil or similar
        return card.getCvvHash();  // assume it's stored plain for testing
    }
}