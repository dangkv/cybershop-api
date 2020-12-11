# cybershop-api
McGill - Fall2020 - CCCS425 - Web Services - Project 2

# summary

---

# maps

## cartTable
| fields | datatype | description |
| --- | --- | --- |
| username | varchar | PK/FK, unique username from userTable |
| cartList | list | list of itemIds in cart |

## chatTable
| fields | datatype | description |
| --- | --- | --- |
| username | varchar | PK/FK, unique username from userTable |
| recipient | varchar | FK, unique username from userTable. username of recipient | 
| messages | list | list of messegaes |

## itemTable
| fields | datatype | description |
| --- | --- | --- |
| itemId | integer | PK, unique id, aka listingId |
| sellerUsername | varchar | FK, unique username from userTable, username of seller |
| description | varchar | item description |
| price | integer | price of item |
| isSold | bool | indicates if item is sold |

## purchaseHistoryTable
| fields | datatype | description |
| --- | --- | --- |
| username | varchar | PK/FK, unique username from userTable |
| purchasedList | list | list of itemIds purchased |

## sellerReviewTable
| fields | datatype | description |
| --- | --- | --- |
| sellerUsername | varchar | PK/FK, unique username from userTable, username of seller |
| from | varchar | FK, unique username from userTable, username of reviewer |
| numStars | integer | rating from 1 to 5 |
| content | varchar | item review |
| itemId | integer | FK, unique id from itemTable |

## shipTable
| fields | datatype | description |
| --- | --- | --- |
| itemId | integer | PK/FK, unique id from itemTable |
| sellerUsername | varchar | FK, unique username from userTable. username of seller |

## tokenTable
| fields | datatype | description |
| --- | --- | --- |
| token | integer | PK, unique id |
| username | varchar | FK, unique username from userTable |

## userTable
| fields | datatype | description |
| --- | --- | --- |
| username | varchar | PK, unique username |
| password | varchar | users password |

