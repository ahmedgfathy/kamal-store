const sequelize = require("../src/config/database");
const { User, Category, Product } = require("../src/models");

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Database synced.");

    const admin = await User.create({
      firstName: "Admin", lastName: "Aurum", email: "admin@aurumco.com",
      password: "admin123", phone: "+201000000000", role: "admin",
    });

    const customer = await User.create({
      firstName: "Sara", lastName: "Ahmed", email: "sara@example.com",
      password: "sara123", phone: "+201123456789", role: "customer",
    });
    console.log("Users created (admin + demo customer).");

    const categories = await Category.bulkCreate([
      { name: "Kitchen Essentials", nameAr: "المطبخ", slug: "kitchen", sortOrder: 1, image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&q=80" },
      { name: "Home Decor", nameAr: "ديكور المنزل", slug: "home-decor", sortOrder: 2, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80" },
      { name: "Tableware", nameAr: "أدوات المائدة", slug: "tableware", sortOrder: 3, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80" },
      { name: "Storage & Organization", nameAr: "التخزين والتنظيم", slug: "storage", sortOrder: 4, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80" },
      { name: "Bathroom", nameAr: "الحمام", slug: "bathroom", sortOrder: 5, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80" },
      { name: "Linens & Textiles", nameAr: "المنسوجات", slug: "linens", sortOrder: 6, image: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=400&q=80" },
    ]);
    console.log("Categories created.");

    const [kitchen, decor, tableware, storage, bathroom, linens] = categories;

    await Product.bulkCreate([
      {
        name: "Cast Iron Dutch Oven", nameAr: "قدر حديد مسبوك", slug: "cast-iron-dutch-oven",
        description: "Premium cast iron Dutch oven with wooden handle knob. Perfect for slow cooking and braising. Distributes heat evenly and retains warmth for hours.",
        descriptionAr: "قدر حديد مسبوك فاخر مع غطاء خشبي. مثالي للطبخ البطيء.",
        price: 2999, comparePrice: 3499, sku: "KIT-001", stock: 25, categoryId: kitchen.id,
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"],
        isFeatured: true, rating: 4.8, reviewCount: 124,
      },
      {
        name: "Non-Stick Saucepan Set", nameAr: "طقم قدور غير لاصقة", slug: "non-stick-saucepan-set",
        description: "Set of 3 non-stick saucepans with ergonomic handles. Durable ceramic coating for healthy cooking without oil.",
        descriptionAr: "طقم من 3 قدور غير لاصقة بمقبض مريح.",
        price: 1899, comparePrice: 2299, sku: "KIT-002", stock: 30, categoryId: kitchen.id,
        images: ["https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&q=80"],
        isFeatured: true, rating: 4.6, reviewCount: 89,
      },
      {
        name: "Bamboo Kitchen Utensil Set", nameAr: "طقم أدوات مطبخ من الخيزران", slug: "bamboo-kitchen-utensil-set",
        description: "6-piece bamboo cooking utensil set. Heat resistant, sustainable and gentle on your cookware.",
        descriptionAr: "طقم من 6 قطع أدوات طبخ من الخيزران. مستدامة وصديقة للبيئة.",
        price: 299, sku: "KIT-003", stock: 70, categoryId: kitchen.id,
        images: ["https://images.unsplash.com/photo-1584990347449-a5c8d7f3d9d8?w=600&q=80"],
        rating: 4.4, reviewCount: 210,
      },
      {
        name: "Minimalist Ceramic Vase", nameAr: "مزهرية سيراميك بسيطة", slug: "minimalist-ceramic-vase",
        description: "Handcrafted ceramic vase with matte finish. Perfect for dried flowers or as a standalone decor piece.",
        descriptionAr: "مزهرية سيراميك يدوية الصنع بلمسة نهائية غير لامعة.",
        price: 449, comparePrice: 599, sku: "DEC-001", stock: 40, categoryId: decor.id,
        images: ["https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&q=80"],
        isFeatured: true, rating: 4.7, reviewCount: 67,
      },
      {
        name: "Woven Jute Throw Pillow", nameAr: "وسادة جوت منسوجة", slug: "woven-jute-throw-pillow",
        description: "Natural jute accent pillow with soft cotton insert. Adds texture and warmth to any sofa.",
        descriptionAr: "وسادة زينة من الجوت الطبيعي مع حشوة قطنية ناعمة.",
        price: 349, sku: "DEC-002", stock: 55, categoryId: decor.id,
        images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80"],
        rating: 4.3, reviewCount: 48,
      },
      {
        name: "Stoneware Dinner Set", nameAr: "طقم أطباق خزفية", slug: "stoneware-dinner-set",
        description: "12-piece stoneware dinner set in natural sand tones. Microwave and dishwasher safe.",
        descriptionAr: "طقم أطباق خزفية من 12 قطعة بألوان رملية طبيعية.",
        price: 1299, comparePrice: 1599, sku: "TAB-001", stock: 22, categoryId: tableware.id,
        images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80"],
        isFeatured: true, rating: 4.9, reviewCount: 156,
      },
      {
        name: "Glass Serving Bowls Set", nameAr: "طقم أطباق تقديم زجاجية", slug: "glass-serving-bowls-set",
        description: "Set of 5 borosilicate glass bowls in graduated sizes. Perfect for salads, fruits and serving.",
        descriptionAr: "طقم 5 أطباق تقديم زجاجية بأحجام مختلفة. مثالية للسلطات والفواكه.",
        price: 749, sku: "TAB-002", stock: 35, categoryId: tableware.id,
        images: ["https://images.unsplash.com/photo-1617802690658-1173a812650d?w=600&q=80"],
        rating: 4.5, reviewCount: 93,
      },
      {
        name: "Woven Storage Baskets", nameAr: "سلال تخزين منسوجة", slug: "woven-storage-baskets",
        description: "Set of 3 handwoven seagrass baskets. Great for organizing blankets, toys, or any room.",
        descriptionAr: "طقم 3 سلال منسوجة يدوياً من عشب البحر. رائعة لتنظيم أي غرفة.",
        price: 599, comparePrice: 749, sku: "STO-001", stock: 45, categoryId: storage.id,
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"],
        isFeatured: true, rating: 4.6, reviewCount: 78,
      },
      {
        name: "Acrylic Storage Containers", nameAr: "حاويات تخزين أكريليك", slug: "acrylic-storage-containers",
        description: "Airtight clear acrylic containers for pantry staples. Stackable design to save space.",
        descriptionAr: "حاويات أكريليك محكمة الإغلاق لحفظ المطبخ. قابلة للتكديس لتوفير المساحة.",
        price: 899, sku: "STO-002", stock: 28, categoryId: storage.id,
        images: ["https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80"],
        rating: 4.4, reviewCount: 65,
      },
      {
        name: "Bamboo Bath Mat", nameAr: "سجادة حمام من الخيزران", slug: "bamboo-bath-mat",
        description: "Natural bamboo bath mat with anti-slip base. Durable, water resistant and easy to clean.",
        descriptionAr: "سجادة حمام من الخيزران الطبيعي بقاعدة مقاومة للانزلاق.",
        price: 449, sku: "BAT-001", stock: 32, categoryId: bathroom.id,
        images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80"],
        rating: 4.5, reviewCount: 41,
      },
      {
        name: "Organic Cotton Bath Towels", nameAr: "مناشف حمام قطنية عضوية", slug: "organic-cotton-bath-towels",
        description: "Set of 4 ultra-soft organic cotton bath towels. Highly absorbent and quick-drying.",
        descriptionAr: "طقم 4 مناشف حمام من القطن العضوي فائق النعومة.",
        price: 999, comparePrice: 1199, sku: "BAT-002", stock: 20, categoryId: bathroom.id,
        images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80"],
        isFeatured: true, rating: 4.8, reviewCount: 112,
      },
      {
        name: "Linen Duvet Cover Set", nameAr: "طقم غطاء لحاف كتان", slug: "linen-duvet-cover-set",
        description: "European flax linen duvet cover set. Breathable, naturally temperature-regulating and gets softer with every wash.",
        descriptionAr: "طقم غطاء لحاف من الكتان الأوروبي. قابل للتنفس وينعم مع كل غسلة.",
        price: 2499, comparePrice: 2999, sku: "LIN-001", stock: 18, categoryId: linens.id,
        images: ["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80"],
        isFeatured: true, rating: 4.9, reviewCount: 87,
      },
      {
        name: "Chunky Knit Throw Blanket", nameAr: "بطانية محبوكة سميكة", slug: "chunky-knit-throw-blanket",
        description: "Hand-knit chunky cotton throw blanket. Cozy texture perfect for cold evenings on the couch.",
        descriptionAr: "بطانية محبوكة يدوياً من القطن السميك. مثالية للأمسيات الباردة.",
        price: 849, sku: "LIN-002", stock: 26, categoryId: linens.id,
        images: ["https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600&q=80"],
        rating: 4.7, reviewCount: 59,
      },
    ]);
    console.log("Products seeded.");

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
