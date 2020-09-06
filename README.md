# Shopping list

## Purpose
Users can add items to the shopping list, which then will be saved into a database, so whenever, from whatever devices someone visits this application they will see the items previously added to the list.

## Functionalities
### Password protection
Only people can use the app who know the predefined username and password. This ensures that only the privacy of the shopping list. The credentials are the following:

- ´Username´: username
- ´Password´: password

### Database connectivity
The application is connected to a MongoDB database, so the items will be stored in the databse for future use.

### Sanitized HTML
The input is sanitized meaning that no harmful code will be added to the list, so this makes the use of the app safe for future users.

### Adding, editing and deleting individual items
Users can add, edit and delete individual items

### Clear all items
Users can clear all items once the shopping is done and ready to fill the list again for the next shopping.

## Stack used
- HTML
- Javascript
- Bootstrap
- Node.js
- Express.js