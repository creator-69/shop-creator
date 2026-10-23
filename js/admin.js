(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const loginPanel=$("#loginPanel"), dashboard=$("#dashboard"), loginForm=$("#loginForm"), productForm=$("#productForm");
  const loginMessage=$("#loginMessage"), formMessage=$("#formMessage"), rows=$("#productRows"), toastNode=$("#toast");
  let products=[], editingId=null, currentImage="", chosenFile=null, toastTimer;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = value => Number(value||0).toLocaleString("en-US")+" Toman";
  const categoryName = value => ({watch:"Watches",smart:"Smart tech",accessory:"Accessories"}[value]||value);
  function toast(message) { toastNode.textContent=message; toastNode.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toastNode.classList.remove("show"),2600); }
  async function api(url, options={}) {
    const response=await fetch(url,{credentials:"same-origin",...options,headers: options.body instanceof FormData ? (options.headers||{}) : {"Content-Type":"application/json",...(options.headers||{})}});
    const type=response.headers.get("content-type")||"";
    const data=type.includes("application/json")?await response.json():{};
    if(!response.ok) throw new Error(data.error||("Request failed ("+response.status+")"));
    return data;
  }
  function showDashboard(show) { loginPanel.hidden=show; dashboard.hidden=!show; }
  async function checkSession() {
    try { await api("/api/admin/me"); showDashboard(true); await loadProducts(); }
    catch (_) { showDashboard(false); }
  }
  loginForm.addEventListener("submit",async event=>{
    event.preventDefault(); loginMessage.textContent="Signing in…";
    const data=Object.fromEntries(new FormData(loginForm));
    try { await api("/api/admin/login",{method:"POST",body:JSON.stringify(data)}); loginForm.reset(); loginForm.elements.username.value="admin"; loginMessage.textContent=""; showDashboard(true); await loadProducts(); }
    catch(error) { loginMessage.textContent=error.message; }
  });
  $("#logoutButton").addEventListener("click",async()=>{
    try { await api("/api/admin/logout",{method:"POST",body:"{}"}); } catch (_) {}
    showDashboard(false); toast("Signed out");
  });
  async function loadProducts() {
    rows.innerHTML='<tr><td colspan="5" class="empty-cell">Loading catalogue…</td></tr>';
    try { const data=await api("/api/admin/products"); products=data.products||[]; renderRows(); renderStats(); }
    catch(error) { rows.innerHTML='<tr><td colspan="5" class="empty-cell">'+escapeHtml(error.message)+'</td></tr>'; }
  }
  function renderStats() {
    $("#statTotal").textContent=products.length;
    $("#statActive").textContent=products.filter(p=>p.active).length;
    $("#statLow").textContent=products.filter(p=>Number(p.stock)<=5).length;
    $("#tableCount").textContent=products.length;
  }
  function renderRows() {
    const query=$("#tableSearch").value.trim().toLowerCase(), category=$("#categoryFilter").value;
    const filtered=products.filter(p=>(!category||p.category===category)&&(!query||(p.name+" "+p.detail+" "+p.tag).toLowerCase().includes(query)));
    if(!filtered.length) { rows.innerHTML='<tr><td colspan="5" class="empty-cell">No matching products.</td></tr>'; return; }
    rows.innerHTML=filtered.map(p=>'<tr><td><div class="product-cell">'+(p.image?'<img src="'+escapeHtml(p.image_url||p.image)+'" alt="" loading="lazy">':'<span class="mini-placeholder">C</span>')+'<div><strong>'+escapeHtml(p.name)+'</strong><small>'+escapeHtml(categoryName(p.category))+'</small></div></div></td><td class="price-cell">'+money(p.price)+'</td><td><span class="stock-pill '+(Number(p.stock)<=5?'low':'')+'">'+Number(p.stock)+'</span></td><td><span class="status-pill '+(p.active?'published':'draft')+'">'+(p.active?'Published':'Hidden')+'</span></td><td><div class="row-actions"><button type="button" data-edit="'+escapeHtml(p.id)+'">Edit</button><button type="button" class="danger" data-delete="'+escapeHtml(p.id)+'">Delete</button></div></td></tr>').join("");
  }
  $("#tableSearch").addEventListener("input",renderRows);
  $("#categoryFilter").addEventListener("change",renderRows);
  $("#refreshButton").addEventListener("click",loadProducts);
  rows.addEventListener("click",event=>{
    const edit=event.target.closest("[data-edit]"), del=event.target.closest("[data-delete]");
    if(edit) startEdit(edit.dataset.edit);
    if(del) deleteProduct(del.dataset.delete);
  });
  function startEdit(id) {
    const p=products.find(item=>item.id===id); if(!p)return;
    editingId=id; currentImage=p.image||""; chosenFile=null;
    for(const key of ["name","category","price","stock","tag","detail"]) productForm.elements[key].value=p[key]??"";
    productForm.elements.active.checked=Boolean(p.active);
    $("#formTitle").textContent="Edit product"; $("#formMode").textContent="EDIT"; $("#saveButton").innerHTML='Save changes <span>→</span>'; $("#cancelEdit").hidden=false;
    formMessage.textContent=""; showPreview(currentImage); $("#editorPanel").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function resetForm() {
    editingId=null; currentImage=""; chosenFile=null; productForm.reset(); productForm.elements.stock.value=10; productForm.elements.active.checked=true;
    $("#formTitle").textContent="Add a product"; $("#formMode").textContent="NEW"; $("#saveButton").innerHTML='Save product <span>→</span>'; $("#cancelEdit").hidden=true;
    $("#imageFile").value=""; showPreview(""); formMessage.textContent="";
  }
  $("#cancelEdit").addEventListener("click",resetForm);
  $("#imageFile").addEventListener("change",()=>{
    const file=$("#imageFile").files[0]; if(!file)return;
    if(file.size>5*1024*1024) { formMessage.textContent="Image must be 5 MB or smaller."; $("#imageFile").value=""; return; }
    chosenFile=file; showPreview(URL.createObjectURL(file));
  });
  $("#removeImage").addEventListener("click",()=>{chosenFile=null;currentImage="";$("#imageFile").value="";showPreview("");});
  function showPreview(src) {
    $("#imagePreview").hidden=!src;
    if(src) $("#previewImage").src=src;
    else $("#previewImage").removeAttribute("src");
  }
  productForm.addEventListener("submit",async event=>{
    event.preventDefault(); formMessage.textContent="Saving product…"; $("#saveButton").disabled=true;
    try {
      if(chosenFile) {
        const form=new FormData(); form.append("image",chosenFile);
        const uploaded=await api("/api/uploads",{method:"POST",body:form}); currentImage=uploaded.image;
      }
      const body={name:productForm.elements.name.value.trim(),category:productForm.elements.category.value,price:Number(productForm.elements.price.value),stock:Number(productForm.elements.stock.value),tag:productForm.elements.tag.value.trim()||"NEW",detail:productForm.elements.detail.value.trim(),image:currentImage,active:productForm.elements.active.checked};
      const wasEditing = Boolean(editingId);
      if(wasEditing) await api("/api/admin/products/"+encodeURIComponent(editingId),{method:"PUT",body:JSON.stringify(body)});
      else await api("/api/admin/products",{method:"POST",body:JSON.stringify(body)});
      resetForm();
      await loadProducts();
      toast(wasEditing ? "Product updated" : "Product saved");
    } catch(error) { formMessage.textContent=error.message; }
    finally { $("#saveButton").disabled=false; }
  });
  async function deleteProduct(id) {
    const product=products.find(p=>p.id===id); if(!product)return;
    if(!confirm('Delete "'+product.name+'"? This cannot be undone.'))return;
    try { await api("/api/admin/products/"+encodeURIComponent(id),{method:"DELETE"}); if(editingId===id)resetForm(); await loadProducts(); toast("Product deleted"); }
    catch(error) { toast(error.message); }
  }
  checkSession();
})();