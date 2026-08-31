package com.golf.golf_project.dashboard.controllers;

import com.golf.golf_project.dashboard.services.AdminDashboardService;
import com.golf.golf_project.exeptions.dto.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@AllArgsConstructor
public class DashboardController {

    private AdminDashboardService adminDashboardService;

    /**
     * All admin dashboard analytics in a single request: KPIs, users growth,
     * reservations trend, activity heatmap and top clubs.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminDashboard() {
        return ResponseEntity.ok(
                ApiResponse.success(
                        adminDashboardService.getAdminDashboard(),
                        "Admin dashboard data retrieved successfully"
                )
        );
    }
}