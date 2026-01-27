import {
  collection, query, orderBy, limit, startAfter, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let lastDoc = null;
let loading = false;

async function loadPosts() {
  if (loading) return;
  loading = true;

  let q = query(
    collection(db,"posts"),
    orderBy("time","desc"),
    limit(5),
    ...(lastDoc ? [startAfter(lastDoc)] : [])
  );

  const snap = await getDocs(q);
  lastDoc = snap.docs[snap.docs.length - 1];

  snap.forEach(d => renderPost(d.data()));
  loading = false;
}

function renderPost(p){
  const div=document.createElement("div");
  div.className="post";
  div.innerHTML=`
    <img src="${p.avatar||''}" class="avatar">
    <b>${p.name}</b>
    <p>${p.text}</p>
    ${p.img?`<a download href="${p.img}">
      <img src="${p.img}" class="postImg"></a>`:""}
  `;
  feed.appendChild(div);
}

feed.addEventListener("scroll", ()=>{
  if(feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 50){
    loadPosts();
  }
});

loadPosts();
