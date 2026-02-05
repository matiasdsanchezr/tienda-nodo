import { Prisma, PrismaClient, Product } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type ProductData = Omit<Product, "id">;

const allProducts: ProductData[] = [
  {
    name: "Apple iPhone 16 Pro Max (256 GB) - Titanio negro",
    price: new Prisma.Decimal(2039999),
    image:
      "https://images.fravega.com/f1000/0c061d21343235404877b19710175c91.jpg",
    category: "Electrónica",
    stock: 15,
    description:
      "El iPhone 16 Pro Max, lanzado en septiembre de 2024, destaca por su pantalla de 6,9 pulgadas, chip A18 Pro de alto rendimiento, sistema avanzado de triple cámara de 48 MP y un diseño de titanio ligero y resistente. Enfocado en Apple Intelligence, incluye el nuevo Control de Cámara y una batería de mayor duración",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: 'Notebook Samsung Galaxy Book 3 Pro 14" Intel Core i7 32 GB 1TB',
    price: new Prisma.Decimal(2649999),
    image:
      "https://images.fravega.com/f300/07b56857e8c67e6f7d7ad452f169a8ae.jpg.webp",
    category: "Electrónica",
    stock: 8,
    description:
      'La notebook Samsung Galaxy Book 3 Pro 14" (modelo NP940XFG-KS3AR) destaca por su diseño ultra liviano (menos de 1,3 kg) y potente rendimiento, equipada con un procesador Intel Core i7-1360P de 13ª generación, 32 GB de RAM LPDDR5 y 1 TB SSD. Ofrece una impresionante pantalla Dynamic AMOLED 2X de 14" con resolución 3K (2880x1800), ideal para productividad profesional y consumo multimedia.',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Auriculares JBL Bluetooth Tune 770NC Negro",
    price: new Prisma.Decimal(182849),
    image:
      "https://images.fravega.com/f300/57a1e7980963228991d6de110f704ae1.jpg.webp",
    category: "Electrónica",
    stock: 25,
    description:
      "Sus materiales ligeros, sus suaves almohadillas y su banda de sujeción acolchada te permitirán llevar estos auriculares cómodamente durante largos periodos de tiempo. Gracias al diseño plegable, estos auriculares son muy fáciles de llevar, de modo que podrás disfrutar de tu música favorita dónde y cuándo quieras.",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Cafetera Espresso Peabody Digital PE-CED5000IX",
    price: new Prisma.Decimal(159999),
    image:
      "https://images.fravega.com/f300/5991ef166ec3b3a20f69b2b8f7dc7092.jpg.webp",
    category: "Hogar",
    stock: 12,
    description:
      "Esta cafetera espresso Peabody no solo te ayudará a preparar los mejores cafés, sino que también le dará un toque de estilo a tu cocina o estación de café gracias a su diseño compacto, minimalista y elegante.",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Aspiradora Robot Philco RVCF25PI con Trapeadora",
    price: new Prisma.Decimal(229999),
    image:
      "https://images.fravega.com/f300/4ee295ed26af6372907764483613938e.jpg.webp",
    category: "Hogar",
    stock: 7,
    description:
      "La aspiradora robot Philco RCVF25PI es una solución avanzada para mantener tu hogar limpio y saludable, especialmente si tienés mascotas. Este modelo destaca por su diseño multifuncional que combina aspirado y trapeo, además de contar con un filtro HEPA para una limpieza profunda. Este modelo incorpora una función de trapeo con agua que se activa automáticamente al ensamblar el dispositivo. Cuenta con una bomba electrónica que ajusta los parámetros de funcionamiento para un rendimiento óptimo, permitiendo una limpieza húmeda eficiente sin necesidad de intervención manual.",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Bicicleta Mountain Bike SLP 10 Pro Rodado 29” T18",
    price: new Prisma.Decimal(289999),
    image:
      "https://images.fravega.com/f300/4f4d19b5f5c69f15ed484548c6c8a1f3.jpg.webp",
    category: "Deportes",
    stock: 5,
    description: "Para todo terreno",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Bota Trekking Patria Trek Negro 44",
    price: new Prisma.Decimal(125780),
    image:
      "https://images.fravega.com/f300/087645f25073c6cb2bc4d468685ce41d.jpg.webp",
    category: "Deportes",
    stock: 30,
    description:
      "Incorpora la tecnología innovadora impermeable y transpirable en su forro. El tejido ofrece una transpirabilidad excepcional para que puedas beneficiarte de un Botín impermeable para caminar sin pasar calor ni sudar, o protegiéndote del Frio exterior, cualquiera que sea el clima. Posee más detalles que la hacen sumamente cómoda. Las plantillas HI-POLY proporcionan amortiguación y capacidad de respuesta, y, junto con el fondo de Goma/Eva, maximizan el retorno de energía para un ritmo de pisada mucho más eficiente. El Botín Trek está diseñado específicamente para rutas exigentes: el diseño de la suela está mejorado para adaptarse a terrenos ondulados y rocosos, agarrándose a cualquier superficie húmeda, seca, suelta... y la puntera reforzada y el refuerzo en el talón ayuda a proteger de impactos y magullones en los dedos y el tobillo. Si te gusta moverte con el nivel de apoyo necesario, pero sin peso extra, entonces el Botín Trek está hecho para vos!",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Smartwatch Samsung Galaxy Fit 3 Dark Gray",
    price: new Prisma.Decimal(114999),
    image:
      "https://images.fravega.com/f300/2d4093bb735d33e3fe8be3540f215eaa.jpg.webp",
    category: "Electrónica",
    stock: 18,
    description:
      "Con un diseño elegante y liviano, Galaxy Fit3 se adapta cómodamente a tu rutina de ejercicios. El ligero cuerpo de aluminio, tan liviano como 18,5 g, no te pesará ni estorbará durante los entrenamientos. Además, las clasificaciones 5ATM e IP68 significan que está preparado para enfrentar gotas de lluvia o polvo. Enfocate en hacer ejercicio y mantenete en forma.",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Mochila Hidratante Gadnic Running",
    price: new Prisma.Decimal(64999),
    image:
      "https://images.fravega.com/f300/5d4123361f7ddc44bde4cc2035a8e477.jpg.webp",
    category: "Deportes",
    stock: 20,
    description:
      "¡Bienvenido al mundo del running! Si eres un amante de esta actividad física, sabrás lo importante que es mantenerse hidratado durante tus entrenamientos y carreras. Y es por eso que hoy queremos presentarte nuestra Mochila Hidratante de running, un accesorio indispensable para cualquier corredor que quiera mantener su rendimiento al máximo. Esta mochila cuenta con un sistema de hidratación integrado, lo que te permitirá llevar contigo la cantidad suficiente de agua o bebida isotónica para mantenerte hidratado durante todo el recorrido. Además, su diseño ergonómico y ajustable te permitirá llevarla cómodamente en tu espalda sin comprometer tu movilidad. ¡No esperes más para probar nuestra Mochila Hidratante para llevar tu entrenamiento al siguiente nivel!",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Licuadora Peabody PE-LN810B 800W Blanco",
    price: new Prisma.Decimal(89999),
    image:
      "https://images.fravega.com/f300/2c6272699be2073b5fab2dbbb194baa2.jpg.webp",
    category: "Hogar",
    stock: 10,
    description:
      "La licuadora Peabody PE-LN810B es un electrodoméstico de mesa de 800W de potencia y color blanco, destacada por su jarra de vidrio de 1,75 litros resistente a temperaturas y su sistema de 6 cuchillas (Six Blade) de acero inoxidable, ideal para triturar hielo y lograr mezclas homogéneas. Cuenta con 2 velocidades, función pulse, diseño robusto con doble rulemán y base antideslizante. ",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Cámara Canon EOS R100 KIT 18-45",
    price: new Prisma.Decimal(1382249.01),
    image:
      "https://images.fravega.com/f300/e57cdf959a8ce367333479aef2452976.jpg.webp",
    category: "Electrónica",
    stock: 4,
    description:
      "Descubrí la potencia de la Canon EOS R100, la cámara ideal para quienes buscan dar el siguiente paso en fotografía y video de alta calidad.\n\nEste kit incluye el versátil lente RF-S, perfecto para capturar desde paisajes amplios hasta retratos detallados. Con su sensor CMOS de 24.1 MP y el avanzado procesador DIGIC 8, obtendrás imágenes nítidas y brillantes, incluso en condiciones de poca luz. Además, la EOS R100 permite grabar en 4K, ideal para quienes buscan videos con calidad cinematográfica.\n\nGracias a su enfoque automático Dual Pixel AF y sus funciones de conectividad como Wi-Fi y Bluetooth, podrás compartir y transferir tus mejores momentos de forma rápida y sencilla. Su diseño compacto y ergonómico la convierte en la compañera perfecta para llevar a todos lados.\n\nLa Canon EOS R100 ofrece un rendimiento profesional en una cámara ligera y fácil de usar, ideal para explorar la fotografía en todas sus posibilidades.",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
  {
    name: "Kit Mancuernas + Barra Trexa GBFW261 20Kg Tope A Rosca Discos Pesas",
    price: new Prisma.Decimal(49999),
    image:
      "https://images.fravega.com/f300/46dbf709e5f0ab7b22a2319221174f95.jpg.webp",
    category: "Deportes",
    stock: 15,
    description:
      "Entrená en casa con versatilidad y seguridad gracias a este completo kit de mancuernas y barra de 20 kg. Ideal para tonificar músculos, mejorar fuerza y aumentar resistencia cardiovascular, es perfecto para quienes buscan un entrenamiento completo sin invertir en equipos grandes.\n\nIncluye:\n4 discos de 1,25 kg\n4 discos de 1,5 kg\n4 discos de 2 kg\n2 barras con mancuernas de 40 cm\n4 tuercas\n1 conector de barra de 40 cm",
    createdAt: new Date(Date.now()),
    updatedAt: new Date(),
  },
];

async function main() {
  // const count = await prisma.product.deleteMany({})
  // console.log(count)
  // for (const product of allProducts) {
  //   const result = await prisma.product.upsert({
  //     update: { ...product },
  //     create: { ...product },
  //   });
  //   console.log(result);
  // }
  for (const product of allProducts) {
    const result = await prisma.product.create({ data: product });
    console.log(result);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
