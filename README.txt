Things to add:

Frontend:
1- fix SSO signup: must add user to local mongodb - see Thien's note below
2- add content skeleton loader
3- fix my car card
4- add stripe payment
5- fix choose listing
6- images must be uploaded on cloudinare
7- create new listing -> address must use the searchbar functionality geolocation
8- fix charge requests + backend functionality
9- zustand for state management
10- fix empty cards UI

Backend:
1- fix availability for bookings
2- add rating system

Thien's note:
- Delete user was not functioning properly - it uses findOneandUpdate instead of findOneandDelete. Hence, it was not deleting the user - fixed in UserController.js
- Created user profile in MongoDB if the user signs up via Google/Apple - added to sign-up.tsx file
- Added name and phone number as additional fields when creating a user - added in lib->user.ts
- Added email and phone number duplicate checks - added in UserController.js
- There are bugs when trying to sign up and sign in - still needs fixing
