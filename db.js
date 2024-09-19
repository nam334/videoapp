// Factors
// 1.Open database
// 2.Create Object store
// 3.Make transactions ->
// Perform operations (data add, retrieval, removal)

// Open database -> DB version 1 (by default)
// First time,
// Initially -> upgrade needed
// -> success

// Afterwards, version 1 -> success
//             version 2 -> upgrade
//                       -> success

//STEP 1 - OPEN DATABASE
let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success", (e) => {
  console.log("DB success");
  db = openRequest.result;
});

openRequest.addEventListener("error", (e) => {
  console.log("DB error");
});

openRequest.addEventListener("upgradeneeded", (e) => {
  console.log("DB upgraded and also for initial DB connection");
  db = openRequest.result;

  //STEP 2 - CREATE AN OBJECT STORE
  //CAN BE CREATED ONLY IN UPGRADE NEEDED EVENT
  console.log(db);
  db.createObjectStore("video", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});
