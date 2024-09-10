package com.CreditCard.CreditCardFr.controler;

import com.CreditCard.CreditCardFr.model.FraudData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;

@RestController
@RequestMapping("/api")
public class FraudDetectionController {

    @PostMapping("/predict")
    public ResponseEntity<String> predictFraud(@RequestBody FraudData data) {
        try {
            // Convert the received data to JSON
            ObjectMapper mapper = new ObjectMapper();
            String inputJson = mapper.writeValueAsString(data);

            // Write the JSON data to a temporary file
            File tempFile = File.createTempFile("inputData", ".json");
            try (PrintWriter writer = new PrintWriter(new FileWriter(tempFile))) {
                writer.write(inputJson);
            }

            // Create a process to run the Python script with the path to the file as an argument
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "C:/Users/mooha/Documents/EMSI/CreditFraud/env/Scripts/python.exe",
                    "C:/Users/mooha/Documents/EMSI/CreditFraud/predict_fraud2.py",
                    tempFile.getAbsolutePath()
            );

            Process process = processBuilder.start();

            // Read the output from the Python script (prediction)
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String result;
            StringBuilder output = new StringBuilder();
            while ((result = reader.readLine()) != null) {
                output.append(result);
            }

            // Read errors from the Python script
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder errorOutput = new StringBuilder();
            String errorLine;
            while ((errorLine = errorReader.readLine()) != null) {
                errorOutput.append(errorLine).append("\n");
            }

            // Check for errors
            if (errorOutput.length() > 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error executing Python script: " + errorOutput.toString());
            }

            // Delete the temporary file
            tempFile.delete();

            // Return the prediction as a response
            return ResponseEntity.ok(output.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during prediction");
        }
    }
}
