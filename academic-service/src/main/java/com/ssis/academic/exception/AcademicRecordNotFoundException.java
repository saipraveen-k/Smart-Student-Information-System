package com.ssis.academic.exception;

public class AcademicRecordNotFoundException extends RuntimeException {
    public AcademicRecordNotFoundException(String message) {
        super(message);
    }
}
