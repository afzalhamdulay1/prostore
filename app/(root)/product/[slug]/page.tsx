import { getProductBySlug } from "@/lib/actions/product.actions";
// import ProductDetailsContent from "./ProductDetailsContent";
import { notFound } from "next/navigation";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      {/* <ProductDetailsContent product={product} /> */}
      hello {slug}
    </>
  );
};

export default ProductDetailsPage;
