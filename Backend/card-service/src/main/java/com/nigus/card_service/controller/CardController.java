package com.nigus.card_service.controller;

import com.nigus.card_service.dto.*;
import com.nigus.card_service.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.*;

import java.util.List;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.nigus.card_service.dto.*;
import com.nigus.card_service.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {

    private final CardService cardService;

    @PostMapping
    public CardResponse create(@Valid @RequestBody CardCreateRequest request) {
        return cardService.createCard(request);
    }

    @GetMapping("/account/{accountId}")
    public List<CardResponse> getCards(@PathVariable Long accountId) {
        return cardService.getCards(accountId);
    }

    @PutMapping("/freeze/{cardId}")
    public void freeze(@PathVariable Long cardId) {
        cardService.freeze(cardId);
    }

    @PutMapping("/block/{cardId}")
    public void block(@PathVariable Long cardId) {
        cardService.block(cardId);
    }

    @PutMapping("/pin")
    public void changePin(@Valid @RequestBody ChangePinRequest request) {
        cardService.changePin(request);
    }

    @PutMapping("/limit")
    public void setLimit(@Valid @RequestBody SpendingLimitRequest request) {
        cardService.setLimit(request);
    }
    @GetMapping("/{cardId}/cvv")
    public ResponseEntity<Map<String, String>> getCvv(@PathVariable Long cardId) {
        String cvv = cardService.getCvv(cardId);
        Map<String, String> response = new HashMap<>();
        response.put("cvv", cvv);
        return ResponseEntity.ok(response);
    }
}
