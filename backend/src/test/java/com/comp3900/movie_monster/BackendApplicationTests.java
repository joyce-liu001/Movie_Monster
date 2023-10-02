//package com.comp3900.movie_monster;
//
//import com.comp3900.movie_monster.user.User;
//import com.comp3900.movie_monster.user.UserAccessService;
//import com.comp3900.movie_monster.user.UserResponse;
//import com.mongodb.client.MongoClients;
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.mongodb.core.query.Query;
//import org.springframework.http.ResponseEntity;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Objects;
//import java.util.UUID;
//
//@SpringBootTest
//class BackendApplicationTests {
//
//	private UserAccessService userAccessService = new UserAccessService();
//	private MongoTemplate mongoTemplate = new MongoTemplate(MongoClients.create("mongodb://localhost:27017"), "3900project");
//
//	private List<User> loadUsers() {
//		List<User> db = new ArrayList<>();
//		User user1 = new User();
//		user1.setEmail("owen@gmail.com");
//		user1.setPassword("Owen is not people");
//		user1.setUsername("Owen");
//		user1.setUserId(UUID.randomUUID().toString());
//		db.add(user1);
//
//		User user2 = new User();
//		user2.setEmail("damon@gmail.com");
//		user2.setPassword("Owen is not people");
//		user2.setUsername("damon");
//		user2.setUserId(UUID.randomUUID().toString());
//		db.add(user2);
//
//		User user3 = new User();
//		user3.setEmail("joyce@gmail.com");
//		user3.setPassword("Owen is not people");
//		user3.setUsername("joyce");
//		user3.setAdmin(true);
//		user3.setUserId(UUID.randomUUID().toString());
//		db.add(user3);
//
//		User user4 = new User();
//		user4.setEmail("matt@gmail.com");
//		user4.setPassword("Owen is not people");
//		user4.setUsername("matt");
//		user4.setUserId(UUID.randomUUID().toString());
//		db.add(user4);
//
//		User user5 = new User();
//		user5.setEmail("tam@gmail.com");
//		user5.setPassword("Owen is not people");
//		user5.setUsername("tam");
//		user5.setUserId(UUID.randomUUID().toString());
//		db.add(user5);
//
//		return db;
//	}
//
//	@Test
//	public void testRegister() {
//		List<User> users = loadUsers();
//		List<String> uIds = new ArrayList<>();
//		for (User user: users) {
//			ResponseEntity<UserResponse> re = userAccessService.register(user);
//			uIds.add(Objects.requireNonNull(re.getBody()).getUId());
//		}
//		int i = 0;
//		for (String uId: uIds) {
//			User user = mongoTemplate.findById(uId, User.class, "User");
//			assert user != null;
//			assert user.getEmail().equals(users.get(i).getEmail());
//			i += 1;
//		}
//	}
//
//	@Test
//	public void testRegisterFailed() {
//		User user1 = new User();
//		user1.setEmail("I am owen");
//		user1.setPassword("smallsmallsmall");
//
//		ResponseEntity<UserResponse> re= userAccessService.register(user1);
//		assert re.getStatusCodeValue() == 400;
//
//		user1.setEmail("owen@gmail.com");
//		assert userAccessService.register(user1).getStatusCodeValue() == 400;
//
//		user1.setEmail("no_one_use@gmail.com");
//		user1.setPassword("short");
//
//		assert userAccessService.register(user1).getStatusCodeValue() == 400;
//	}
//
//	@Test
//	public void testLogin(){
//		List<User> users = loadUsers();
//		List<String> uIds = new ArrayList<>();
//		for (User user:users) {
//			String email = user.getEmail();
//			String password = user.getPassword();
//			ResponseEntity<UserResponse> re = userAccessService.login(email, password);
//			uIds.add(Objects.requireNonNull(re.getBody()).getUId());
//		}
//
//		int i = 0;
//		for (String uId: uIds) {
//			User user = mongoTemplate.findById(uId, User.class, "User");
//			assert user != null;
//			assert user.getEmail().equals(users.get(i).getEmail());
//			assert user.getTokens().size() != 1;
//			i += 1;
//		}
//	}
////
////	@Test
////	public void testLogout() {
////		String email = "owen@gmail.com";
////		Query query = new Query();
////		query.addCriteria(Criteria.where("email").is(email));
////		User user = mongoTemplate.findOne(query, User.class, "User");
////
////	}
//
//}
