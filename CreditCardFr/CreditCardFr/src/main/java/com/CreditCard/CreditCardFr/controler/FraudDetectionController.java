    package com.CreditCard.CreditCardFr.controler;

    import com.CreditCard.CreditCardFr.dto.FraudDataCrudeDTO;
    import com.CreditCard.CreditCardFr.dto.FraudDataDTO;
    import com.CreditCard.CreditCardFr.enumeration.Type;
    import com.CreditCard.CreditCardFr.model.FraudData;
    import com.CreditCard.CreditCardFr.repository.FraudDataRepository;
    import com.CreditCard.CreditCardFr.service.FraudDataService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/api")
    @CrossOrigin(origins = "http://localhost:4200")
    public class FraudDetectionController {

        @Autowired
        private FraudDataService fraudDataService;
        @Autowired
        FraudDataRepository fraudDataRepository;

        // CREATE
        @PostMapping("/create")
        public ResponseEntity<FraudData> createFraudData(@RequestBody FraudDataCrudeDTO dto) {
            return fraudDataService.createFraudData(dto);
        }

        // READ all
        @GetMapping("/all")
        public ResponseEntity<List<FraudData>> getAllFraudData() {
            return fraudDataService.getAllFraudData();
        }

        @GetMapping("/fraud-data")
        public Page<FraudData> getLimitedFraudData(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "1000") int size) {
            return fraudDataService.getLimitedFraudData(page,size);
        }
        // READ one by ID
        @GetMapping("/{id}")
        public ResponseEntity<FraudData> getFraudDataById(@PathVariable Long id) {
            return fraudDataService.getFraudDataById(id);
        }

        // UPDATE
        @PutMapping("/update/{id}")
        public ResponseEntity<FraudData> updateFraudData(@PathVariable Long id, @RequestBody FraudDataCrudeDTO dto) {
            return fraudDataService.updateFraudData(id, dto);
        }

        // DELETE
        @DeleteMapping("/delete/{id}")
        public ResponseEntity<Void> deleteFraudData(@PathVariable Long id) {
            return fraudDataService.deleteFraudData(id);
        }

        // Predict Fraud (Optional - if you need an endpoint to test the prediction separately)
        @PostMapping("/predict")
        public ResponseEntity<String> predictFraud(@RequestBody FraudDataDTO dto) {

            System.out.println(dto.getType());
            return ResponseEntity.ok(fraudDataService.predictFraud(dto));
        }

        // Filtre par isFraud (0, 1, 2)
        @GetMapping("/filter/isFraud")
        public ResponseEntity<List<FraudData>> filterByIsFraud(@RequestParam int isFraud) {
            return fraudDataService.getFraudDataByIsFraud(isFraud);
        }
        @PostMapping("/import-csv")
        public String importCsv(@RequestParam String filePath) {
            fraudDataService.saveCsvDataToDb(filePath);
            return "Les données CSV ont été importées avec succès.";
        }

        @GetMapping("/count")
        public int nombreRow(){

            return (int) fraudDataRepository.count();
        }


        @GetMapping("/countByIsFraud")
        public ResponseEntity<Long> countByIsFraud(@RequestParam int isFraud) {
            try {
                long count = fraudDataService.countByIsFraud(isFraud);
                return ResponseEntity.ok(count);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(null);
            }
        }

        // Controller Spring Boot
        @GetMapping("/stats")
        public ResponseEntity<Map<String, Long>> getStats() {
            long totalTransactions = fraudDataRepository.count();
            long normalCount = fraudDataService.countByIsFraud(0);
            long suspectCount = fraudDataService.countByIsFraud(1);
            long fraudCount = fraudDataService.countByIsFraud(2);

            Map<String, Long> stats = new HashMap<>();
            stats.put("totalTransactions", totalTransactions);
            stats.put("normalCount", normalCount);
            stats.put("suspectCount", suspectCount);
            stats.put("fraudCount", fraudCount);

            return ResponseEntity.ok(stats);
        }

        @GetMapping("/type-stats")
        public Map<String, Long> getStatsByType(@RequestParam Type type) {
            Map<String, Long> stats = new HashMap<>();
            stats.put("normalCount", fraudDataService.getNormalCountByType(type));
            stats.put("suspectCount", fraudDataService.getSuspectCountByType(type));
            stats.put("fraudCount", fraudDataService.getFraudCountByType(type));
            return stats;
        }

    }