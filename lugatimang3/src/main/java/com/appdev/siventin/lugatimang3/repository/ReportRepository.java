package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.siventin.lugatimang3.entity.ReportEntity;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<ReportEntity, Integer> {
    List<ReportEntity> findByStatus(ReportEntity.ReportStatus status);
}
