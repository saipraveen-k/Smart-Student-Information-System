package com.ssis.course.aspect;

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

    @Pointcut("within(com.ssis.course.controller..) || within(com.ssis.course.service..)")
    public void applicationPackagePointcut() {
    }

    @Around("applicationPackagePointcut()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();
        log.info("[AOP ENTRY] CourseService Method: {} with arguments: {}", methodName, Arrays.toString(args));

        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long elapsedTime = System.currentTimeMillis() - startTime;
            log.info("[AOP EXIT] CourseService Method: {} executed in {} ms", methodName, elapsedTime);
            return result;
        } catch (Throwable ex) {
            log.error("[AOP EXCEPTION] Exception in CourseService Method: {} with message: {}", methodName, ex.getMessage());
            throw ex;
        }
    }
}
