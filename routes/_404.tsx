import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return <p class="text-center text-white text-4xl ">404 hashtag not found</p>;
}