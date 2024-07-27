import { ApiResponseProperty } from '@nestjs/swagger'

export default class SignInResponse {
  @ApiResponseProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiYmViZWRlYmVAZ21haWwuY29tIiwic3ViIjoiOGFkYTI5YmItNWM1MS00ZGQ5LTk4MTktNGZiNTE3NWRkNWFjIiwiZmlyc3ROYW1lIjoiYWJiZWJlIiwibGFzdE5hbWUiOiJrZWJlZGUiLCJVc2VyVHlwZSI6IkNMSUVOVF9VU0VSIiwiaWF0IjoxNzIyMDExNjMwLCJleHAiOjE3MjIwMTE2OTB9.3mVVyi8b2NQDqsVz8PJ-GpbhPmiZpeBVpm4HbNqYip0',
  })
  accessToken: string
}
