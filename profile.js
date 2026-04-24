if(!localStorage.getItem("currentUser")){
  localStorage.setItem("currentUser","user1");
}
// Load saved profile when page opens
window.onload = function () {

  if(!localStorage.getItem("currentUser")){
    localStorage.setItem("currentUser","user1");
  }

  const data = JSON.parse(localStorage.getItem("artsyProfile"));
  if (data){
    profileName.innerText = data.name;
    profileBio.innerText = data.bio;
    profilePic.src = data.img;
  }

  loadMyPosts();
};
// Open popup
function openEditor(){
  editor.classList.remove("hidden");
}

// Close popup
function closeEditor(){
  editor.classList.add("hidden");
}

// Save profile
function saveProfile(){
  const data = {
    name: nameInput.value,
    bio: bioInput.value,
    img: imgInput.value || "https://i.pravatar.cc/200"
  };

  localStorage.setItem("artsyProfile", JSON.stringify(data));

  profileName.innerText = data.name;
  profileBio.innerText = data.bio;
  profilePic.src = data.img;

  closeEditor();
}





function sendMessage() {
  const input = document.getElementById("aiInput");
  const chat = document.getElementById("chatArea");
  const text = input.value.toLowerCase().trim();

  if(text === "") return;

  // show user message
  chat.innerHTML += `<p><b>You:</b> ${text}</p>`;

  let reply = "That sounds interesting! Tell me more 🎨";

  // smart demo replies
  if(text.includes("painting"))
    reply = "Try acrylic or watercolor to start. Both are beginner friendly!";
  else if(text.includes("sketch") || text.includes("draw"))
    reply = "Daily 5-minute sketching improves drawing very fast ✏️";
  else if(text.includes("digital"))
    reply = "Procreate and Photoshop are great for digital art.";
  else if(text.includes("photography"))
    reply = "Lighting is everything in photography. Try golden hour!";
  else if(text.includes("dance"))
    reply = "Practice basics and body balance before complex moves 💃";
  else if(text.includes("music"))
    reply = "Consistency beats talent in music practice 🎵";
  else if(text.includes("hello") || text.includes("hi"))
    reply = "Hello! Ask me anything about art 😊";

  // show AI reply
  setTimeout(()=>{
    chat.innerHTML += `<p><b>AI:</b> ${reply}</p>`;
    chat.scrollTop = chat.scrollHeight;
  },500);

  input.value = "";
}



async function askAI(){
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatMessages");
  const message = input.value.trim();
  if(!message) return;

  chat.innerHTML += "<p><b>You:</b> "+message+"</p>";
  input.value="";

  chat.innerHTML += "<p>Thinking...</p>";

  const response = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer YOUR_API_KEY"
    },
    body:JSON.stringify({
      model:"gpt-4o-mini",
      messages:[{role:"user",content:message}]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  chat.innerHTML += "<p><b>AI:</b> "+reply+"</p>";
  chat.scrollTop = chat.scrollHeight;
}


function loadMyPosts(){

  const container = document.getElementById("myPosts");
  if(!container) return;

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const currentUser = localStorage.getItem("currentUser");

  const myPosts = posts.filter(p => p.owner === currentUser);

  if(myPosts.length === 0){
  container.innerHTML = `
    <div class="empty-state">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png">
        <h3>No blogs yet</h3>
        <p>Your published blogs will appear here ✨</p>
        <a href="add-post.html" class="primary-btn">Write your first blog</a>
    </div>
  `;
  return;
}

  container.innerHTML = "";

  myPosts.reverse().forEach((post,index)=>{
    container.innerHTML += `
      <div class="blog-card">
        <img src="${post.image || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7'}">
        <h3>${post.title}</h3>
        <p>${post.content.substring(0,100)}...</p>
        <button onclick="deleteFromProfile(${index})" class="delete-btn">Delete</button>
      </div>
    `;
  });
}

function deleteFromProfile(index){
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  const currentUser = localStorage.getItem("currentUser");

  // keep only posts NOT belonging to user OR except selected one
  let myIndex = -1;
  posts = posts.filter((p,i)=>{
    if(p.owner === currentUser){
      myIndex++;
      return myIndex !== index;
    }
    return true;
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  loadMyPosts();
}