package com.comp3900.movie_monster.util;
import lombok.Data;
import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.UUID;

@Document
@Data
public class UploadFile {

    @Id
    private String id = UUID.randomUUID().toString();
    private String name;
    private Date createdTime;
    private Binary content;
    private String contentType;
    private long size;

}
