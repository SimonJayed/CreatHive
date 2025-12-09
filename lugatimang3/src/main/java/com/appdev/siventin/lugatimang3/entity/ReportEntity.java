package com.appdev.siventin.lugatimang3.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.LocalDateTime;

@Entity
@Table(name = "report")
public class ReportEntity {

    public enum ReportItemType {
        ARTWORK,
        BLOG,
        USER
    }

    public enum ReportStatus {
        PENDING,
        RESOLVED,
        DISMISSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reportId;

    @Column(name = "reporter_id", nullable = false)
    private int reporterId;

    @Column(name = "reported_item_id", nullable = false)
    private int reportedItemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private ReportItemType itemType;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    public ReportEntity() {
        super();
        this.timestamp = LocalDateTime.now();
    }

    public ReportEntity(int reporterId, int reportedItemId, ReportItemType itemType, String reason) {
        super();
        this.reporterId = reporterId;
        this.reportedItemId = reportedItemId;
        this.itemType = itemType;
        this.reason = reason;
        this.status = ReportStatus.PENDING;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters

    public int getReportId() {
        return reportId;
    }

    public void setReportId(int reportId) {
        this.reportId = reportId;
    }

    public int getReporterId() {
        return reporterId;
    }

    public void setReporterId(int reporterId) {
        this.reporterId = reporterId;
    }

    public int getReportedItemId() {
        return reportedItemId;
    }

    public void setReportedItemId(int reportedItemId) {
        this.reportedItemId = reportedItemId;
    }

    public ReportItemType getItemType() {
        return itemType;
    }

    public void setItemType(ReportItemType itemType) {
        this.itemType = itemType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
