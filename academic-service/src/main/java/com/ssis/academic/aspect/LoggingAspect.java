package com.ssis.academic.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Pointcut("within(com.ssis.academic.controller..) || within(com.ssis.academic.service..)")
    public void applicationPackagePointcut() {
    }

    @Around("applicationPackagePointcut()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();
        log.info("[AOP ENTRY] AcademicService Method: {} with arguments: {}", methodName, Arrays.toString(args));

        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long elapsedTime = System.currentTimeMillis() - startTime;
            log.info("[AOP EXIT] AcademicService Method: {} executed in {} ms", methodName, elapsedTime);
            return result;
        } catch (Throwable ex) {
            log.error("[AOP EXCEPTION] Exception in AcademicService Method: {} with message: {}", methodName, ex.getMessage());
            throw ex;
        }
    }
}
