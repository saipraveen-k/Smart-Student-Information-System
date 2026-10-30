$endpoints = @(
    'http://localhost:8990/api/students',
    'http://localhost:8990/api/courses',
    'http://localhost:8990/api/academic-records',
    'http://localhost:8081/api/students',
    'http://localhost:8082/api/courses',
    'http://localhost:8083/api/academic-records',
    'http://localhost:8084/ws/studentReport.wsdl',
    'http://localhost:3000'
)

foreach ($ep in $endpoints) {
    try {
        $r = Invoke-WebRequest -Uri $ep -UseBasicParsing -TimeoutSec 5
        Write-Host "SUCCESS [$($r.StatusCode)] -> $ep" -ForegroundColor Green
    } catch {
        Write-Host "FAILED -> $ep : $($_.Exception.Message)" -ForegroundColor Red
    }
}
