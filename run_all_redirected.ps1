$javaBin = "C:\Users\saipr\.jdks\jbr-21.0.11\bin\java.exe"
$base = "c:\tempp\projects\clg\api\Smart Student Information System"

$services = @(
    @{ Name = "api-gateway"; Jar = "api-gateway\target\api-gateway-1.0.0.jar" },
    @{ Name = "student-service"; Jar = "student-service\target\student-service-1.0.0.jar" },
    @{ Name = "course-service"; Jar = "course-service\target\course-service-1.0.0.jar" },
    @{ Name = "academic-service"; Jar = "academic-service\target\academic-service-1.0.0.jar" },
    @{ Name = "reporting-service"; Jar = "reporting-service\target\reporting-service-1.0.0.jar" }
)

foreach ($svc in $services) {
    Write-Host "Starting $($svc.Name)..."
    $jarPath = Join-Path $base $svc.Jar
    $outPath = Join-Path $base ("logs\" + $svc.Name + ".log")
    $errPath = Join-Path $base ("logs\" + $svc.Name + "-err.log")
    Start-Process -FilePath $javaBin -ArgumentList "-jar", $jarPath -WorkingDirectory $base -RedirectStandardOutput $outPath -RedirectStandardError $errPath
}

Write-Host "Starting frontend..."
$feDir = Join-Path $base "frontend"
$feOut = Join-Path $base "logs\frontend.log"
$feErr = Join-Path $base "logs\frontend-err.log"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory $feDir -RedirectStandardOutput $feOut -RedirectStandardError $feErr

Write-Host "Done launching processes."
