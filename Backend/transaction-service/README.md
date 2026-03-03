# Transaction Service (local run instructions)

This README explains how to build, run, and test the `transaction-service` locally using the provided `local` profile (H2 in-memory DB and a mock account client).

Prerequisites
- JDK 21 installed and JAVA_HOME set.
- Maven wrapper is included: use `./mvnw.cmd` on Windows PowerShell.

Quick start (PowerShell)

1) Run tests

```powershell
# From project root
.\mvnw.cmd test
```

2) Run the app (local profile uses H2 and MockAccountServiceClient)

```powershell
# Start with the local profile (explicit)
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local

# OR build and run the jar (after packaging)
.\mvnw.cmd -DskipTests package
java -jar target\transaction-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

If `target\transaction-0.0.1-SNAPSHOT.jar` does not exist, you can use `spring-boot:run` which runs the compiled classes in-place.

Endpoints (HTTP, running on http://localhost:8080)

Replace `Invoke-RestMethod` with `curl` or your HTTP client of choice.

1) Deposit
```powershell
Invoke-RestMethod -Uri http://localhost:8080/transactions/deposit -Method Post -ContentType 'application/json' -Body (@{
    accountId = 1
    amount = 100.00
    currency = 'ETB'
    description = 'Initial deposit'
} | ConvertTo-Json)
```

Expect: HTTP 201 and a JSON `TransactionResponse`.

2) Withdraw
```powershell
Invoke-RestMethod -Uri http://localhost:8080/transactions/withdraw -Method Post -ContentType 'application/json' -Body (@{
    accountId = 1
    amount = 10.00
    currency = 'ETB'
    description = 'ATM withdrawal'
} | ConvertTo-Json)
```

Expect: HTTP 201 and a JSON `TransactionResponse` (amount displayed may be negative depending on formatting).

3) Transfer
```powershell
Invoke-RestMethod -Uri http://localhost:8080/transactions/transfer -Method Post -ContentType 'application/json' -Body (@{
    fromAccountId = 1
    toAccountId = 2
    amount = 25.00
    currency = 'ETB'
    description = 'Send money'
} | ConvertTo-Json)
```

Expect: HTTP 200 OK. The mock account client will print debit/credit calls to the app console.

4) Transaction history
```powershell
Invoke-RestMethod -Uri 'http://localhost:8080/transactions/history?accountId=1' -Method Get
```

Expect: JSON array of transactions for the account.

## Running with MySQL (production-like)

To run the service against MySQL instead of the local H2 DB, follow these steps:

1) Create the database (example MySQL commands):

```sql
-- login to MySQL as a user with create database privileges (e.g. root)
CREATE DATABASE IF NOT EXISTS `Transaction_service` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Optionally create a dedicated user:
CREATE USER IF NOT EXISTS 'tx_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON `Transaction_service`.* TO 'tx_user'@'localhost';
FLUSH PRIVILEGES;
```

2) Update `src/main/resources/application-mysql.yml` to set the correct `username` and `password` for your MySQL instance (default in repo uses `root` and a placeholder password).

3) Start the application with the MySQL profile:

```powershell
# from project root
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql

# or run jar
.\mvnw.cmd -DskipTests package
java -jar target\transaction-0.0.1-SNAPSHOT.jar --spring.profiles.active=mysql
```

Note: `spring.jpa.hibernate.ddl-auto: update` will create/update tables automatically when the application starts. For production, prefer using migrations (Flyway/Liquibase) and `ddl-auto: validate`.

Switching to MySQL / Eureka (production-like)
- Edit `src/main/resources/application.yml` and uncomment the MySQL and Eureka settings, or set `--spring.profiles.active=prod` (not provided here).
- Ensure a MySQL instance runs and Eureka server is available if you re-enable the Eureka client.

Notes and troubleshooting
- If you see `Failed to load driver class org.h2.Driver` ensure the `com.h2database:h2` dependency is present in `pom.xml` and rebuild: `.\mvnw.cmd -U -DskipTests package`.
- If Lombok-generated methods are missing during compile, ensure your local JDK and `pom.xml` `<java.version>` match; this project uses Java 21.
- The repository has `MockAccountServiceClient` active under the `local` profile so external `account-service` is not needed for local testing.

Security / CVE notices
- A static scan reported transitive dependency warnings for some Spring Boot and Spring Cloud dependencies; these are warnings from a vulnerability scanner. If you want, I can attempt to upgrade dependencies to newer patched versions automatically (I can run a CVE remediation agent). Ask me to "run CVE remediator" and I'll prepare an upgrade plan and apply safe updates.

If anything fails when you run the commands locally, paste the terminal output here and I'll iterate until it's fully working.
