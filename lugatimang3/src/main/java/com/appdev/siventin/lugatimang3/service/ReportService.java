package com.appdev.siventin.lugatimang3.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdev.siventin.lugatimang3.entity.ReportEntity;
import com.appdev.siventin.lugatimang3.repository.ReportRepository;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public ReportEntity createReport(ReportEntity report) {
        return reportRepository.save(report);
    }

    public List<ReportEntity> getAllReports() {
        return reportRepository.findAll();
    }

    public ReportEntity updateReportStatus(int reportId, ReportEntity.ReportStatus newStatus) {
        ReportEntity report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(newStatus);
        return reportRepository.save(report);
    }
}
