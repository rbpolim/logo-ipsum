type ContainerProps = {
  body: React.ReactElement
}

export const Container = ({
  body
}: ContainerProps) => {
  return (
    <>
      {body}
    </>
  )
}