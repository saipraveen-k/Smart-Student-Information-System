$base = "c:\tempp\projects\clg\api\Smart Student Information System"
$javaBin = "C:\Users\saipr\.jdks\jbr-21.0.11\bin\java.exe"

$services = @(
    @{ Name = "API Gateway"; Port = 8990; Jar = "api-gateway\target\api-gateway-1.0.0.jar"; Log = "logs\api-gateway.log"; Err = "logs\api-gateway-err.log" },
    @{ Name = "Student Service"; Port = 8081; Jar = "student-service\target\student-service-1.0.0.jar"; Log = "logs\student-service.log"; Err = "logs\student-service-err.log" },
    @{ Name = "Course Service"; Port = 8082; Jar = "course-service\target\course-service-1.0.0.jar"; Log = "logs\course-service.log"; Err = "logs\course-service-err.log" },
    @{ Name = "Academic Service"; Port = 8083; Jar = "academic-service\target\academic-service-1.0.0.jar"; Log = "logs\academic-service.log"; Err = "logs\academic-service-err.log" },
    @{ Name = "Reporting Service"; Port = 8084; Jar = "reporting-service\target\reporting-service-1.0.0.jar"; Log = "logs\reporting-service.log"; Err = "logs\reporting-service-err.log" }
)

if (-not (Test-Path "$base\logs")) {
    New-Item -ItemType Directory -Path "$base\logs" -Force | Out-Null
}

foreach ($svc in $services) {
    $conn = Get-NetTCPConnection -LocalPort $svc.Port -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "$($svc.Name) is ALREADY running on port $($svc.Port)." -ForegroundColor Yellow
    } else {
        Write-Host "Starting $($svc.Name) on port $($svc.Port)..." -ForegroundColor Cyan
        $jarPath = Join-Path $base $svc.Jar
        $logPath = Join-Path $base $svc.Log
        $errPath = Join-Path $base $svc.Err
        Start-Process -FilePath $javaBin -ArgumentList "-jar", "`"$jarPath`"" -WorkingDirectory $base -RedirectStandardOutput $logPath -RedirectStandardError $errPath
    }
}

# Frontend
$feConn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($feConn) {
    Write-Host "Frontend is ALREADY running on port 3000." -ForegroundColor Yellow
} else {
    Write-Host "Starting React Frontend on port 3000..." -ForegroundColor Cyan
    $feDir = Join-Path $base "frontend"
    $feLog = Join-Path $base "logs\frontend.log"
    $feErr = Join-Path $base "logs\frontend-err.log"
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory $feDir -RedirectStandardOutput $feLog -RedirectStandardError $feErr
}

Write-Host "All launch commands dispatched. Waiting for services to become ready..." -ForegroundColor Green
