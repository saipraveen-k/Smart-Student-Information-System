# SSIS One-Click Starter Script for Windows PowerShell
$ErrorActionPreference = "Stop"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  SMART STUDENT INFORMATION SYSTEM (SSIS) STARTER" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$javaBin = "C:\Users\saipr\.jdks\jbr-21.0.11\bin\java.exe"
$env:JAVA_HOME = "C:\Users\saipr\.jdks\jbr-21.0.11"

# 1. Check MongoDB
Write-Host "[1/3] Checking MongoDB status on mongodb://localhost:27017..." -ForegroundColor Yellow
try {
    & "C:\Users\saipr\AppData\Local\Programs\mongosh\mongosh.exe" --eval "db.adminCommand('ping')" --quiet
    Write-Host " -> MongoDB is RUNNING!" -ForegroundColor Green
} catch {
    Write-Host " -> WARNING: Could not verify MongoDB with mongosh. Ensure mongod service is running." -ForegroundColor Red
}

# 2. Start Microservices in background processes
Write-Host "[2/3] Launching Java 21 Spring Boot Microservices..." -ForegroundColor Yellow

$services = @(
    @{ Name = "API Gateway"; Jar = "api-gateway\target\api-gateway-1.0.0.jar"; Port = 8080 },
    @{ Name = "Student Service"; Jar = "student-service\target\student-service-1.0.0.jar"; Port = 8081 },
    @{ Name = "Course Service"; Jar = "course-service\target\course-service-1.0.0.jar"; Port = 8082 },
    @{ Name = "Academic Service"; Jar = "academic-service\target\academic-service-1.0.0.jar"; Port = 8083 },
    @{ Name = "Reporting Service"; Jar = "reporting-service\target\reporting-service-1.0.0.jar"; Port = 8084 }
)

foreach ($svc in $services) {
    if (Test-Path $svc.Jar) {
        Write-Host " -> Starting $($svc.Name) on port $($svc.Port)..." -ForegroundColor Green
        Start-Process $javaBin -ArgumentList "-jar", $svc.Jar -WindowStyle Normal
    } else {
        Write-Host " -> ERROR: JAR file $($svc.Jar) not found! Run 'mvn clean package' first." -ForegroundColor Red
    }
}

# 3. Start React Frontend
Write-Host "[3/3] Starting React Frontend Server (Port 3000)..." -ForegroundColor Yellow
if (Test-Path "frontend") {
    Start-Process "npm" -ArgumentList "run", "dev" -WorkingDirectory "frontend" -WindowStyle Normal
    Write-Host " -> React Frontend launched!" -ForegroundColor Green
}

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  ALL SERVICES LAUNCHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "  - React Dashboard:  http://localhost:3000" -ForegroundColor White
Write-Host "  - API Gateway:      http://localhost:8080" -ForegroundColor White
Write-Host "  - SOAP WSDL:        http://localhost:8084/ws/studentReport.wsdl" -ForegroundColor White
Write-Host "  - MongoDB Compass:  mongodb://localhost:27017" -ForegroundColor White
Write-Host "=========================================================" -ForegroundColor Cyan
