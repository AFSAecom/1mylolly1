# Guide de mise à l'échelle

Ce projet utilise React et Supabase. Pour supporter plus d'utilisateurs, voici quelques pistes :

- **Hébergement statique** : le front est généré avec Vite et peut être déployé sur Vercel pour une mise à l'échelle automatique.
- **Base de données** : Supabase s'appuie sur PostgreSQL. Vous pouvez augmenter les ressources du projet ou migrer vers une instance dédiée pour un trafic plus important.
- **Cache et CDN** : activez la mise en cache des requêtes et servez les assets via un CDN pour réduire la charge serveur.
- **Monitoring** : configurez des outils comme Supabase Logs et Vercel Analytics pour surveiller les performances et anticiper les goulots d'étranglement.
- **Tests et CI** : ajoutez des tests automatisés et un pipeline d'intégration continue pour garantir la stabilité lors des montées en charge.

Ce guide donne les grandes lignes pour préparer l'application à une utilisation intensive.
