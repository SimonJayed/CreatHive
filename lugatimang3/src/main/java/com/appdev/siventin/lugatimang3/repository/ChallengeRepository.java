package com.appdev.siventin.lugatimang3.repository;

import com.appdev.siventin.lugatimang3.entity.ChallengeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ChallengeRepository extends JpaRepository<ChallengeEntity, Integer> {

    // Find the currently active challenge based on date
    @Query("SELECT c FROM ChallengeEntity c WHERE c.isActive = true AND :now BETWEEN c.startDate AND c.endDate")
    Optional<ChallengeEntity> findActiveChallenge(LocalDateTime now);

    // Find latest challenge (to check if we need to create a new one)
    Optional<ChallengeEntity> findTopByOrderByEndDateDesc();
}
