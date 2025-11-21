package com.appdev.siventin.lugatimang3.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdev.siventin.lugatimang3.entity.CommentEntity;;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    CommentEntity findByDescription(String content);
}
