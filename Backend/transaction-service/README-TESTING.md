Transaction Service — Local Test & Frontend Integration

Goal
- Allow local testing of `transaction-service` without running other microservices.
- Provide a temporary local account stub (no persistence) so deposit/withdraw/transfer flows work.
- Enable CORS for local frontend (http://localhost:3000).
- Use your local MySQL (no H2).

Quick start (requirements)
- Java 21
- Maven (wrapper included)
- MySQL running locally with credentials matching `src/main/resources/application.yml` (defaults below)

Default DB settings (edit `application.yml` if needed)
- jdbc:mysql://localhost:3306/Transaction_service?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
- username: root
- password: Amha4@kifle4@

Run the app
1. Build:

```powershell
.\mvnw.cmd -DskipTests clean package
```

2. Run:

```powershell
.\mvnw.cmd spring-boot:run
```

Temporary local stubs (for testing only)
- `LocalAccountService` implements `AccountServiceClient` and is enabled by property `app.account.local-stub=true` (default in `application.yml`).
- Behavior: credit/debit calls are logged and are no-ops — they do not update actual balances.

Endpoints to use in Postman
- Deposit (create transaction):
  - POST http://localhost:8080/transactions/deposit
  - Body (JSON):
    {
      "accountId": 1,
      "amount": 100.00,
      "currency": "ETB",
      "description": "Initial deposit"
    }
- Withdraw:
  - POST http://localhost:8080/transactions/withdraw
  - Body similar to deposit
- Transfer:
  - POST http://localhost:8080/transactions/transfer
  - Body (JSON):
    {
      "fromAccountId": 1,
      "toAccountId": 2,
      "amount": 10.00,
      "currency": "ETB",
      "description": "Transfer"
    }
- Transaction history:
  - GET http://localhost:8080/transactions/history?accountId=1

Frontend integration quick notes
- The app allows CORS from http://localhost:3000 by default. If your frontend runs on a different port, change `app.cors.allowed-origins` in `application.yml`.
- From the frontend, send requests to the same endpoints above. No auth is required for local testing.

How to switch to production (short)
- Set `app.account.local-stub=false` in production configuration.
- Enable Eureka client (set `eureka.client.enabled=true` and correct `service-url`) and run `discovery-service` and `account-service`.
- Ensure `AccountServiceClient` Feign endpoints match the account-service API (credit/debit and account creation). Remove LocalAccountService.
- Add Keycloak/Gateway and enable JWT propagation.

If you want me to:
- Add Postman collection JSON for quick import, or
- Add a small example React snippet that calls the deposit endpoint (to quickly integrate the frontend), tell me which and I will add it.

