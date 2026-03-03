// Categories.js - DEBUG VERSION
console.log("🔴 Categories.js file is LOADED");

const categoriesContainer = document.querySelector("#categoriesContainer");
const categoriesTemplate = document.querySelector("#categoriesTemplate");

console.log("🔴 Container element:", categoriesContainer);
console.log("🔴 Template element:", categoriesTemplate);

// Fetch categories from database
export const showCategories = async () => {
  console.log("🔵 showCategories function CALLED");
  
  if (!categoriesContainer) {
    console.error("❌ FATAL: categoriesContainer is null! Check if element with id='categoriesContainer' exists in HTML");
    return;
  }
  
  if (!categoriesTemplate) {
    console.error("❌ FATAL: categoriesTemplate is null! Check if element with id='categoriesTemplate' exists in HTML");
    return;
  }

  try {
    console.log("🟡 Fetching from API: http://localhost:5000/api/categories");
    
    const response = await fetch('http://localhost:5000/api/categories');
    console.log("🟡 Response status:", response.status);
    
    const categories = await response.json();
    console.log("🟢 Categories received:", categories);
    console.log("🟢 Number of categories:", categories.length);
    
    if (categories.length === 0) {
      console.warn("⚠️ No categories found in database");
      return;
    }

    // Clear container first
    console.log("🟡 Clearing container");
    categoriesContainer.innerHTML = '';
    console.log("🟡 Container cleared, current children:", categoriesContainer.children.length);

    console.log("🟡 Starting to loop through categories");
    categories.forEach((category, index) => {
      console.log(`🟢 Processing category ${index + 1}:`, category.name);
      
      const categoryClone = document.importNode(categoriesTemplate.content, true);
      console.log(`   ✅ Template cloned for ${category.name}`);
      
      const card = categoryClone.querySelector(".category-card");
      if (card) {
        card.setAttribute("data-category-id", category.id || category.name);
        console.log(`   ✅ Card attributes set`);
      }
      
      const img = categoryClone.querySelector(".category-image");
      if (img) {
        img.src = category.image || 'https://via.placeholder.com/300x200?text=Category';
        img.alt = category.name;
        console.log(`   ✅ Image set for ${category.name}`);
      }
      
      const nameElem = categoryClone.querySelector(".category-name");
      if (nameElem) {
        nameElem.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        console.log(`   ✅ Name set to:`, nameElem.textContent);
      }
      
      const descElem = categoryClone.querySelector(".category-description");
      if (descElem) {
        descElem.textContent = category.description || `Shop our ${category.name} collection`;
        console.log(`   ✅ Description set`);
      }
      
      // Add click event
      card.addEventListener("click", () => {
        console.log(`   👆 Clicked on ${category.name}`);
        window.location.href = `products.html?category=${category.name}`;
      });
      
      categoriesContainer.appendChild(categoryClone);
      console.log(`   ✅ Appended to container, container now has ${categoriesContainer.children.length} children`);
    });
    
    console.log("✅ ALL DONE! Final container children:", categoriesContainer.children.length);
    
  } catch (error) {
    console.error("❌ ERROR in showCategories:", error);
    categoriesContainer.innerHTML = `<p style="color:red">Error loading categories: ${error.message}</p>`;
  }
};

// Fallback function
const loadLocalCategories = () => {
  console.log("Loading categories from local JSON file...");
  // ... rest of your fallback code
};