# Next.js App Router Course - Starter

Este repositorio surge a partir del material base proporcionado en el curso de [Next.js App Router](https://nextjs.org/learn), el cual se centra en la adquisición de fundamentos sólidos sobre Next.js, su nuevo sistema de enrutamiento (App Router) y las mejores prácticas de arquitectura limpia y principios SOLID.

## Características Principales

- **Seguimiento del Tutorial Oficial:**  
  Este proyecto extiende la plantilla inicial del curso oficial de Next.js, permitiendo comprender el manejo de rutas, páginas, componentes e interacción con APIs internas.

- **Base de Datos Mediante Docker:**  
  En lugar de utilizar la base de datos de Vercel, se ha optado por integrar un entorno de base de datos local basado en Docker. Esta elección facilita el desarrollo aislado, escalable y reproducible, además de mejorar la consistencia entre entornos.  
  - **Beneficios:**  
    - Aislamiento del entorno de desarrollo.  
    - Facilidad para levantar y detener contenedores con `docker-compose`.  
    - Mayor control sobre la configuración y versiones de la base de datos.

- **Pantalla de "Customers" Adicional:**  
  A diferencia del ejemplo original del tutorial, se ha añadido una pantalla de gestión de "Customers". Esta sección, no contemplada inicialmente, ejemplifica la capacidad de extender la aplicación con nuevas entidades y flujos de trabajo, manteniendo la coherencia con los principios de arquitectura limpia y aplicación modular.  
  - **Ventajas de esta Extensión:**  
    - Permite afianzar los conocimientos adquiridos en Next.js a través de un caso práctico adicional.  
    - Refuerza la mantenibilidad del código mediante la separación de responsabilidades y la adherencia a las prácticas SOLID.  
    - Ofrece un escenario más realista para trabajar con datos, pantallas adicionales y flujos CRUD.

## Tecnologías y Prácticas Empleadas

- **Next.js (App Router):** Manejo del enrutamiento a nivel de carpeta, server components e integraciones nativas con React, brindando un rendimiento óptimo y mejor DX (Developer Experience).
- **React:** Uso de componentes funcionales, hooks y patrones de composición.
- **TypeScript:** Tipado estático para mayor robustez, reducción de errores en tiempo de ejecución y escalabilidad.
- **Docker & Docker Compose:** Entornos reproductibles y portables para la base de datos, facilitando la integración continua y el despliegue.
- **Arquitectura Limpia y SOLID:**  
  - **Single Responsibility Principle (SRP):** Cada módulo se encarga de una única responsabilidad clara.  
  - **Open/Closed Principle (OCP):** El código está estructurado para permitir nuevas funcionalidades sin alterar las existentes.  
  - **Liskov Substitution Principle (LSP):** Los componentes son fácilmente intercambiables sin romper la lógica del sistema.  
  - **Interface Segregation Principle (ISP):** Las interfaces están diseñadas para no obligar a los consumidores a depender de métodos que no necesitan.  
  - **Dependency Inversion Principle (DIP):** Las dependencias están abstraídas, permitiendo mayor flexibilidad en las capas inferiores y facilitando los test.

## Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/nextjs-app-router-course-starter.git
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Levantar el entorno de base de datos con Docker:
   ```bash
   docker-compose up -d
   ```
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

NOTA: La aplicación estará disponible en http://localhost:3000


