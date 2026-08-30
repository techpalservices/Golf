package com.golf.golf_project;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Sanity check: the full application context boots correctly.
 * Uses the "test" profile (H2 in-memory DB) so it can run in CI
 * without any real PostgreSQL or .env file.
 */
@SpringBootTest
@ActiveProfiles("test")
class GolfProjectApplicationTests {

    @Test
    void contextLoads() {
    }

}

