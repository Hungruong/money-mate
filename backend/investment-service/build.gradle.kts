plugins {
	java
	id("org.springframework.boot") version "3.4.2"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.money.mate"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
    implementation(platform("software.amazon.awssdk:bom:2.20.148"))
    implementation("software.amazon.awssdk:dynamodb")
    implementation("software.amazon.awssdk:auth")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("org.postgresql:postgresql")
	annotationProcessor("org.projectlombok:lombok")

	// Test dependencies
    testImplementation("org.springframework.boot:spring-boot-starter-test") // Core testing tools (JUnit 5, Mockito)
    testImplementation("org.springframework.security:spring-security-test") // Security testing (optional for now)
    testImplementation("com.h2database:h2") // In-memory DB for integration tests
    testImplementation("org.mockito:mockito-junit-jupiter:5.11.0") // Explicit Mockito with JUnit 5 integration
    testRuntimeOnly("org.junit.platform:junit-platform-launcher") // Ensures JUnit 5 runs correctly
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<org.springframework.boot.gradle.tasks.bundling.BootJar> {
    mainClass.set("com.money.mate.investment_service.InvestmentServiceApplication")
}