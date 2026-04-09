package com.movie.restApi.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.EnableMongoAuditing

@Configuration
@EnableMongoAuditing //for createAt filling
class MongoConfiguration {}