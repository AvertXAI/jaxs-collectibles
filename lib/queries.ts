export const productQuery = `*[_type == "product"] {
  _id,
  name,
  "slug": slug.current,
  price,
  availability,
  stock,
  "categoryName": category->title,
  "brandName": brand->name,
  description,
  "imageUrl": images[0].asset->url,
  coa {
    verified,
    id,
    authenticator
  }
}`;