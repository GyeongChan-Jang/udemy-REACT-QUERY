import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { PostDetail } from './PostDetail'
const maxPostPage = 10

async function fetchPosts(pageNum) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`)
  return response.json()
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage), {
        staleTime: 2000,
        // 이전 페이지로 돌아갔을 때 캐시에 해당 지난 데이터가 있도록
        keepPreviousData: true
      })
    }
  }, [currentPage, queryClient])

  // replace with useQuery
  const { data, isError, isLoading } = useQuery(['posts', currentPage], () => fetchPosts(currentPage), {
    staleTime: 2000
  })
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>something went wrong</div>

  return (
    <>
      <ul>
        {data.map((post) => (
          <li key={post.id} className="post-title" onClick={() => setSelectedPost(post)}>
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  )
}
