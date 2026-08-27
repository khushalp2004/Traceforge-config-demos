# TraceForge Java SDK Installation

TraceForge has been successfully configured for your Spring Boot application!

## What was installed?
1. **TraceForge Spring Boot Starter**: Added to your `pom.xml` or `build.gradle`.
2. **Configuration**: Your API key and Ingest URL were added to `src/main/resources/application.properties` (or `.yml`).
3. **Zero-Touch Configuration**: The SDK will automatically use Spring Boot's AutoConfiguration to intercept all unhandled Exceptions globally!

## How to Test It
To verify everything is working, intentionally crash your app:
1. Open one of your Spring `@RestController` classes.
2. Add a division by zero error inside an endpoint:
   ```java
   @GetMapping("/crash")
   public String crash() {
       int x = 1 / 0; // Boom!
       return "Crash";
   }
   ```
3. Run your app: `./mvnw spring-boot:run` or `./gradlew bootRun`
4. Visit `http://localhost:8080/crash` in your browser.
5. Check your TraceForge Dashboard to see the `ArithmeticException` logged natively!

## Support
For full documentation, visit [usetraceforge.com/docs](https://usetraceforge.com/docs).
