import { useQuery, useMutation } from 'react-query'

async function fetchComments(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
  return response.json()
}

async function deletePost(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, { method: 'DELETE' })
  return response.json()
}

async function updatePost(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, {
    method: 'PATCH',
    data: { title: 'REACT QUERY FOREVER!!!!' }
  })
  return response.json()
}

export function PostDetail({ post }) {
  // 쿼리키를 배열로 만든다면 쿼리에 식별자를 추가하여 쿼리를 구분할 수 있음
  // 비활성화된 쿼리는 캐시에서 제거되지 않음, 캐시 시간 이후에 가비지 컬렉터가 캐시에서 지움
  // 비동기 함수를 화살표 함수로 만드는 것은 인수가 뭐든지간에 호출을 해야하기 때문에
  const { data, isLoading, isError, error } = useQuery(['comments', post.id], () => fetchComments(post.id))

  const deleteMutation = useMutation((postId) => deletePost(postId))
  const updateMutation = useMutation((postId) => updatePost(postId))

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>{error.toString()}</div>

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && <p style={{ color: 'red' }}>Error deleting the post</p>}
      {deleteMutation.isLoading && <p style={{ color: 'purple' }}>deleting the post</p>}
      {deleteMutation.isSuccess && <p style={{ color: 'green' }}>Post has (not) been deleted</p>}
      <button onClick={updateMutation.mutate(post.id)}>Update title</button>
      {updateMutation.isError && <p style={{ color: 'red' }}>Error updating the post</p>}
      {updateMutation.isLoading && <p style={{ color: 'purple' }}>updating the post</p>}
      {updateMutation.isSuccess && <p style={{ color: 'green' }}>Post has (not) been updated</p>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  )
}
