package com.CreditCard.CreditCardFr.repository;

import com.CreditCard.CreditCardFr.model.FraudData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FraudDataRepository extends JpaRepository<FraudData, Long> {

    // Filtrer par isFraud
    List<FraudData> findByIsFraud(int isFraud);

    Page<FraudData> findAll(Pageable pageable);


}