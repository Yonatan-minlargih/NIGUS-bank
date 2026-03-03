package com.task.user_service.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

//   @Column(unique = true, nullable = false)
//   private String keycloakId;           // ← link to Keycloak

   @Column(unique = true, nullable = false)
   private String email;

   private String password;
   private String firstName;
   private String lastName;

   @Column(unique = true)
   private String phoneNumber;

   private String address;

   private Boolean isPremium = false;
   private Boolean twoFactorEnabled = true;

   private LocalDateTime createdAt = LocalDateTime.now();
   private LocalDateTime updatedAt = LocalDateTime.now();

   @PreUpdate
   public void preUpdate() {
      this.updatedAt = LocalDateTime.now();
   }
}