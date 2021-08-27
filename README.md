# Nextjs Social Media Publishing Platform
Tech Stack:
- Nextjs
- Typescript
- Reactjs
- Tailwind CSS
- MariaDB via AWS RDS 

This Project Features: 
- filtering by tags ex: /tag/programming , /tag/health,science or /tag/programming,python,data science
- basic search through title and description
- session based auth  

All api calls are done directly with sql (no orms),  
most of the sql queries can be found under lib/api

All the data is from medium.com, scrapped using python aiohttp

![alt text](https://github.com/nima64/NextjsNewsPublishingPlatform/blob/main/Screenshot%20from%202021-08-24%2022-21-26.png)
