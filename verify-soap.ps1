$soapBody = @"
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://ssis.com/reporting/soap">
   <soapenv:Header/>
   <soapenv:Body>
      <gs:getStudentReportRequest>
         <gs:studentId>STU001</gs:studentId>
      </gs:getStudentReportRequest>
   </soapenv:Body>
</soapenv:Envelope>
"@

Write-Host "Calling SOAP endpoint via API Gateway (http://localhost:8990/ws)..."
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8990/ws" -Method Post -ContentType "text/xml" -Body $soapBody -UseBasicParsing
    Write-Host "Gateway SOAP Response Status: $($res.StatusCode)" -ForegroundColor Green
    Write-Host $res.Content
} catch {
    Write-Host "Gateway SOAP failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nCalling SOAP endpoint directly (http://localhost:8084/ws)..."
try {
    $resDirect = Invoke-WebRequest -Uri "http://localhost:8084/ws" -Method Post -ContentType "text/xml" -Body $soapBody -UseBasicParsing
    Write-Host "Direct SOAP Response Status: $($resDirect.StatusCode)" -ForegroundColor Green
    Write-Host $resDirect.Content
} catch {
    Write-Host "Direct SOAP failed: $($_.Exception.Message)" -ForegroundColor Red
}
