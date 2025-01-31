plugins {
	java
	id("org.springframework.boot") version "3.4.2"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.money.mate"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion.set(JavaLanguageVersion.of(21))
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
	// Spring Boot Web Starter (REST API)
	implementation("org.springframework.boot:spring-boot-starter-web")

	// AWS SDK for DynamoDB
    implementation(platform("software.amazon.awssdk:bom:2.20.148"))
	implementation("software.amazon.awssdk:dynamodb")
    implementation("software.amazon.awssdk:auth")

	// Lombok (reduces boilerplate code)
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// Spring Boot DevTools (hot reload)
	developmentOnly("org.springframework.boot:spring-boot-devtools")

	// Testing dependencies
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<org.springframework.boot.gradle.tasks.bundling.BootJar> {
	mainClass.set("com.money.mate.notification_service.NotificationServiceApplication")
}
