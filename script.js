let posts = JSON.parse(localStorage.getItem("posts")) || [];
let saved = JSON.parse(localStorage.getItem("saved")) || [];

function savePosts(){ localStorage.setItem("posts",JSON.stringify(posts)); }
function saveSaved(){ localStorage.setItem("saved",JSON.stringify(saved)); }

function readingTime(text){
  return Math.ceil(text.split(" ").length/200);
}

function addPost(){
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let category = document.getElementById("category").value;
  let content = document.getElementById("content").value;
  let file = document.getElementById("imageUpload").files[0];

  if(!title || !author || !content){
    alert("Please fill title, author and content");
    return;
  }

  if(file){
    let reader = new FileReader();
    reader.onload = function(){
  posts.push({
  title,
  author,
  category,
  content,
  image: file ? reader.result : null,
  likes: 0,
  owner: localStorage.getItem("currentUser") || "guest"
});
      savePosts();
      window.location="blog.html";
    }
    reader.readAsDataURL(file);
  }
  else{
   posts.push({
  title,
  author,
  category,
  content,
  image:null,
  likes:0,
  owner: localStorage.getItem("currentUser")  // "guest"
});
    savePosts();
    window.location="blog.html";
  }
}
function loadPosts(){
  const userPosts = JSON.parse(localStorage.getItem("posts")) || [];
  const container = document.getElementById("posts");
  if(!container) return;

  container.innerHTML = "";

  // SHOW SAMPLE POSTS ALWAYS FIRST
  loadSamplePosts();

  // THEN SHOW USER POSTS (if any)
  if(userPosts.length === 0) return;

  userPosts.slice().reverse().forEach((post,index) => {

    let deleteBtn = "";
    if(post.owner === localStorage.getItem("currentUser")){
      deleteBtn = `<button class="delete-btn" onclick="deleteMyPost(${index})">Delete</button>`;
    }

    container.innerHTML += `
      <div class="blog-card">
        <img src="${post.image || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7'}"
             onclick="openBlog('${post.title}','${post.content}','${post.image}')">

        <h3 onclick="openBlog('${post.title}','${post.content}','${post.image}')">${post.title}</h3>
        <p onclick="openBlog('${post.title}','${post.content}','${post.image}')">
          ${post.content.substring(0,80)}...
        </p>

        <div class="card-actions">
          <button onclick="savePost(${index})">Save 💾</button>
          ${deleteBtn}
        </div>
      </div>
    `;
  });
}

// SAMPLE POSTS (MUST BE OUTSIDE loadPosts)
function loadSamplePosts(){
  const samplePosts = [
    {
      title:"Why Every Artist Needs a Sketchbook",
      text:"A sketchbook is not just paper. It becomes your safe space, your experiment lab, and your progress tracker. Every messy line becomes proof that you showed up.",
      img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f"
    },
    {
      title:"Finding Inspiration When You Feel Empty",
      text:"Inspiration doesn’t come when you chase it. It appears when you slow down. Walk outside. Notice colors, textures and light.",
      img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    },
    {
      title:"Digital Art vs Traditional Art",
      text:"Digital art gives speed and flexibility. Traditional art gives texture and emotion. Both are tools — the magic is the artist.",
      img:"https://images.unsplash.com/photo-1529101091764-c3526daf38fe"
    }
  ];

  const container = document.getElementById("posts");

  samplePosts.forEach(post => {
    container.innerHTML += `
      <div class="blog-card"
           onclick="openBlog('${post.title}','${post.text}','${post.img}')">
        <img src="${post.img}">
        <h3>${post.title}</h3>
        <p>${post.text.substring(0,80)}...</p>
      </div>
    `;
  });
}




function likePost(i){ posts[i].likes++; savePosts(); loadPosts(); }
function deletePost(i){ posts.splice(i,1); savePosts(); loadPosts(); }

function savePost(i){

  let saved = JSON.parse(localStorage.getItem("saved")) || [];
  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  const alreadySaved = saved.some(p => p.title === posts[i].title);

  if(alreadySaved){
    alert("Already saved!");
    return;
  }

  saved.push(posts[i]);
  localStorage.setItem("saved", JSON.stringify(saved));

  alert("Saved 💖");
}

function loadSaved(){

  let container = document.getElementById("savedPosts");
  let empty = document.getElementById("emptyState");
  if(!container) return;

  let saved = JSON.parse(localStorage.getItem("saved")) || [];

  container.innerHTML = "";

  if(saved.length === 0){
    if(empty) empty.style.display = "block";
    return;
  }

  if(empty) empty.style.display = "none";

  saved.forEach(p=>{
    container.innerHTML += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.content.substring(0,120)}...</p>
      </div>
    `;
  });
}

function toggleDark(){
  document.body.classList.toggle("dark");
}

function inspireMe(){
  if(posts.length==0){ alert("No posts yet!"); return; }
  let r = Math.floor(Math.random()*posts.length);
  alert(posts[r].content);
}

window.onload = () => {
  loadPosts();
  loadSaved();
  loadVideos();
};

function uploadVideo(){
  const title = document.getElementById("videoTitle").value;
  const file = document.getElementById("videoFile").files[0];

  if(!file) return alert("Upload a video");

  const reader = new FileReader();
  reader.onload = function(e){
    const videos = JSON.parse(localStorage.getItem("videos")) || [];
    videos.push({title, data:e.target.result});
    localStorage.setItem("videos", JSON.stringify(videos));
    loadVideos();
  }
  reader.readAsDataURL(file);
}

function loadVideos(){
  const videos = JSON.parse(localStorage.getItem("videos")) || [];
  const container = document.getElementById("videoContainer");
  if(!container) return;

  container.innerHTML="";
  videos.forEach(v=>{
    container.innerHTML += `
      <div class="video-card">
        <h4>${v.title}</h4>
        <video controls src="${v.data}"></video>
      </div>
    `;
  });
}
function askAI(){
  const input = document.getElementById("aiInput").value.toLowerCase();
  const output = document.getElementById("aiResponse");

  const ideas = [
    "Try painting using only 3 colors 🎨",
    "Create a moodboard from magazine cutouts ✂️",
    "Start a daily sketch challenge ✏️",
    "Photograph shadows during sunset 🌇",
    "Write a poem inspired by rain 🌧️",
    "Make a recycled DIY craft ♻️"
  ];

  output.innerText = ideas[Math.floor(Math.random()*ideas.length)];
}
function toggleChat(){
  let chat=document.getElementById("aiChat");
  chat.style.display = chat.style.display==="block" ? "none" : "block";
}



// CLOSE BLOG MODAL
function closeBlog(){
  document.getElementById("blogModal").style.display = "none";
}

function openBlog(title, text, img) {
  localStorage.setItem("blogTitle", title);
  localStorage.setItem("blogText", text);
  localStorage.setItem("blogImg", img);

  window.location.href = "read.html";
}

function deleteMyPost(index){
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.splice(index,1);
  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}