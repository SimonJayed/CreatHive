package com.appdev.siventin.lugatimang3.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "artist")

public class ArtistEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int artistId;
    private String username;
    private String email;
    private String password;
    private String bio;
    private LocalDateTime dateCreated;

    public ArtistEntity() {
    }

    public ArtistEntity(int artistId, String username, String email, String password, String bio,
            LocalDateTime dateCreated) {
        super();
        this.artistId = artistId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.dateCreated = dateCreated;
    }

    public int getArtistId() {
        return artistId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getBio() {
        return bio;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

}
