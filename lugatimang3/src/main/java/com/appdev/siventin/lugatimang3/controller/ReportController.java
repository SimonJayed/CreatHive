package com.appdev.siventin.lugatimang3.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.appdev.siventin.lugatimang3.entity.ReportEntity;
import com.appdev.siventin.lugatimang3.service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ReportEntity createReport(@RequestBody ReportEntity report) {
        return reportService.createReport(report);
    }

    @GetMapping
    public List<ReportEntity> getAllReports() {
        // In a real app, protect this endpoint with role checks
        return reportService.getAllReports();
    }

    @PutMapping("/{id}/status")
    public ReportEntity updateReportStatus(@PathVariable int id, @RequestBody String status) {
        // Simple string parsing for now. Input should be "RESOLVED", "DISMISSED", etc.
        // Remove quotes if present
        String cleanStatus = status.replace("\"", "");
        return reportService.updateReportStatus(id, ReportEntity.ReportStatus.valueOf(cleanStatus));
    }
}
