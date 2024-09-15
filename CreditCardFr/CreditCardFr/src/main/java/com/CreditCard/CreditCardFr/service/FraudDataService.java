package com.CreditCard.CreditCardFr.service;

import com.CreditCard.CreditCardFr.dto.FraudDataCrudeDTO;
import com.CreditCard.CreditCardFr.dto.FraudDataDTO;
import com.CreditCard.CreditCardFr.enumeration.Type;
import com.CreditCard.CreditCardFr.model.FraudData;
import com.CreditCard.CreditCardFr.repository.FraudDataRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.*;
import java.util.*;

@Service
public class FraudDataService {

    @Autowired
    private FraudDataRepository fraudDataRepository;

    // CREATE
    public ResponseEntity<FraudData> createFraudData(FraudDataCrudeDTO dto) {
        FraudData fraudData = new FraudData();
        fraudData.setType(dto.getType());
        fraudData.setAmount(dto.getAmount());
        fraudData.setNameOrig(dto.getNameOrig());
        fraudData.setOldbalanceOrg(dto.getOldbalanceOrg());
        fraudData.setNewbalanceOrig(dto.getNewbalanceOrig());
        fraudData.setNameDest(dto.getNameDest());
        fraudData.setOldbalanceDest(dto.getOldbalanceDest());
        fraudData.setNewbalanceDest(dto.getNewbalanceDest());

        // Prepare data for prediction
        FraudDataDTO fraudDataDTO = new FraudDataDTO(
                dto.getType(),
                dto.getAmount(),
                dto.getOldbalanceOrg(),
                dto.getOldbalanceDest(),
                dto.getNewbalanceDest()
        );

        // Predict fraud
        String predictionResult = predictFraud(fraudDataDTO);

        // Convert prediction result to an integer (0 or 1 for isFraud)
        int isFraud = Integer.parseInt(predictionResult.trim());

        // Set isFraud in fraudData
        fraudData.setIsFraud(isFraud);

        // Save fraud data in the repository
        FraudData savedData = fraudDataRepository.save(fraudData);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedData);
    }

    // READ all with a limit of 3213 rows, sorted by a specific column (e.g., 'id')
    public ResponseEntity<List<FraudData>> getAllFraudData() {
        int limit = 3213;

        // Retrieve all data sorted by 'id' in descending order (change 'id' to your sorting field)
        List<FraudData> allData = fraudDataRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        // If data size is greater than the limit, take only the last 'limit' rows
        if (allData.size() > limit) {
            allData = allData.subList(0, limit);  // Take the first 3213 items since it's already sorted in descending order
        }

        return ResponseEntity.ok(allData);
    }


    // READ one by ID
    public ResponseEntity<FraudData> getFraudDataById(Long id) {
        Optional<FraudData> fraudData = fraudDataRepository.findById(id);
        return fraudData.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // UPDATE
    public ResponseEntity<FraudData> updateFraudData(Long id, FraudDataCrudeDTO dto) {
        Optional<FraudData> existingFraudData = fraudDataRepository.findById(id);
        if (existingFraudData.isPresent()) {
            FraudData fraudData = existingFraudData.get();
            fraudData.setType(dto.getType());
            fraudData.setAmount(dto.getAmount());
            fraudData.setNameOrig(dto.getNameOrig());
            fraudData.setOldbalanceOrg(dto.getOldbalanceOrg());
            fraudData.setNewbalanceOrig(dto.getNewbalanceOrig());
            fraudData.setNameDest(dto.getNameDest());
            fraudData.setOldbalanceDest(dto.getOldbalanceDest());
            fraudData.setNewbalanceDest(dto.getNewbalanceDest());

            // Prepare data for prediction
            FraudDataDTO fraudDataDTO = new FraudDataDTO(
                    dto.getType(),
                    dto.getAmount(),
                    dto.getOldbalanceOrg(),
                    dto.getOldbalanceDest(),
                    dto.getNewbalanceDest()
            );

            // Predict fraud
            String predictionResult = predictFraud(fraudDataDTO);

            // Convert prediction result to an integer (isFraud)
            int isFraud = Integer.parseInt(predictionResult.trim());

            // Set isFraud in fraudData
            fraudData.setIsFraud(isFraud);

            FraudData updatedData = fraudDataRepository.save(fraudData);
            return ResponseEntity.ok(updatedData);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // DELETE
    public ResponseEntity<Void> deleteFraudData(Long id) {
        Optional<FraudData> fraudData = fraudDataRepository.findById(id);
        if (fraudData.isPresent()) {
            fraudDataRepository.delete(fraudData.get());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // PREDICT FRAUD METHOD
    public String predictFraud(FraudDataDTO data) {
        try {
            // Convert FraudDataDTO to a Map with integer type representation
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("type", data.getTypeAsInt()); // Use integer representation
            dataMap.put("amount", data.getAmount());
            dataMap.put("oldbalanceOrg", data.getOldbalanceOrg());
            dataMap.put("oldbalanceDest", data.getOldbalanceDest());
            dataMap.put("newbalanceDest", data.getNewbalanceDest());

            // Convert Map to JSON
            ObjectMapper mapper = new ObjectMapper();
            String inputJson = mapper.writeValueAsString(dataMap);
            System.out.println("Sending data: " + inputJson);

            // Create temporary file
            File tempFile = File.createTempFile("inputData", ".json");
            try (PrintWriter writer = new PrintWriter(new FileWriter(tempFile))) {
                writer.write(inputJson);
            }

            // Execute Python script
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "C:/Users/mooha/Documents/EMSI/CreditFraud/env/Scripts/python.exe",
                    "C:/Users/mooha/Documents/EMSI/CreditFraud/predict_fraud2.py",
                    tempFile.getAbsolutePath()
            );

            Process process = processBuilder.start();

            // Read the output of the Python script
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String result;
            StringBuilder output = new StringBuilder();
            while ((result = reader.readLine()) != null) {
                output.append(result);
            }

            // Read the error stream of the Python script
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder errorOutput = new StringBuilder();
            String errorLine;
            while ((errorLine = errorReader.readLine()) != null) {
                errorOutput.append(errorLine).append("\n");
            }

            // Delete temporary file
            tempFile.delete();

            // Check for errors
            if (errorOutput.length() > 0) {
                throw new RuntimeException("Error executing Python script: " + errorOutput.toString());
            }

            // Return the prediction result from the Python script
            return output.toString();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error during prediction");
        }
    }

    // Filtre par isFraud (0, 1, ou 2) avec une limite de 641880
    public ResponseEntity<List<FraudData>> getFraudDataByIsFraud(int isFraud) {
        if (isFraud < 0 || isFraud > 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Mauvaise requête si isFraud n'est pas 0, 1, ou 2
        }

        List<FraudData> filteredData = fraudDataRepository.findByIsFraud(isFraud);

        // Limite de 641880 lignes
        int limit = 3213;

        // Si la taille des données filtrées est supérieure à la limite, prendre les dernières lignes
        if (filteredData.size() > limit) {
            filteredData = filteredData.subList(filteredData.size() - limit, filteredData.size());
        }

        return ResponseEntity.ok(filteredData);
    }


    public void saveCsvDataToDb(String filePath) {
        try (CSVReader reader = new CSVReaderBuilder(new FileReader(filePath)).build()) {
            List<String[]> allData = reader.readAll();
            List<FraudData> fraudDataList = new ArrayList<>();

            // Ignore the header if your CSV file has one
            allData.remove(0);

            for (String[] nextLine : allData) {
                // Create a FraudData object for each line
                FraudData fraudData = new FraudData();
                fraudData.setType(mapToType(nextLine[1])); // Adjust indices based on your CSV structure
                fraudData.setAmount(Double.parseDouble(nextLine[2]));
                fraudData.setNameOrig(nextLine[3]);
                fraudData.setOldbalanceOrg(Double.parseDouble(nextLine[4]));
                fraudData.setNewbalanceOrig(Double.parseDouble(nextLine[5]));
                fraudData.setNameDest(nextLine[6]);
                fraudData.setOldbalanceDest(Double.parseDouble(nextLine[7]));
                fraudData.setNewbalanceDest(Double.parseDouble(nextLine[8]));
                fraudData.setIsFraud(Integer.parseInt(nextLine[9]));

                // Add the object to the list
                fraudDataList.add(fraudData);
            }

            // Save the list to the database
            fraudDataRepository.saveAll(fraudDataList);

        } catch (IOException | CsvException e) {
            e.printStackTrace();
        }
    }
    public Type mapToType(String value) {
        switch (value) {
            case "1":
                return Type.PAYMENT;
            case "2":
                return Type.CASH_OUT;
            case "3":
                return Type.CASH_IN;
            case "4":
                return Type.TRANSFER;
            case "5":
                return Type.DEBIT;
            default:
                throw new IllegalArgumentException("Unexpected value: " + value);
        }
    }

    public Page<FraudData> getLimitedFraudData( int page, int size) {
        // Limite de 641880 données
        int maxResults = 2000;
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<FraudData> resultPage = fraudDataRepository.findAll(pageRequest);

        if ((page + 1) * size > maxResults) {
            int remaining = maxResults - (page * size);
            if (remaining > 0) {
                return fraudDataRepository.findAll(PageRequest.of(page, remaining));
            } else {
                return Page.empty();
            }
        }

        return resultPage;
    }

    public long countByIsFraud(int isFraud) {
        if (isFraud < 0 || isFraud > 2) {
            throw new IllegalArgumentException("Invalid isFraud value: " + isFraud);
        }
        return fraudDataRepository.countByIsFraud(isFraud);
    }

    public long countByIsFraudByType(Type type, int isFraud) {
        return fraudDataRepository.countByIsFraudAndType(type, isFraud);
    }

    public long getNormalCountByType(Type type) {
        return countByIsFraudByType(type, 0);
    }

    public long getSuspectCountByType(Type type) {
        return countByIsFraudByType(type, 1);
    }

    public long getFraudCountByType(Type type) {
        return countByIsFraudByType(type, 2);
    }

    // UPDATE isFraud
    public ResponseEntity<FraudData> updateIsFraud(Long id, int isFraud) {
        // Validate the isFraud value
        if (isFraud < 0 || isFraud > 2) {
            return ResponseEntity.badRequest().build(); // Bad request if isFraud is not 0, 1, or 2
        }

        Optional<FraudData> existingFraudData = fraudDataRepository.findById(id);
        if (existingFraudData.isPresent()) {
            FraudData fraudData = existingFraudData.get();
            fraudData.setIsFraud(isFraud);
            FraudData updatedData = fraudDataRepository.save(fraudData);
            return ResponseEntity.ok(updatedData);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


}