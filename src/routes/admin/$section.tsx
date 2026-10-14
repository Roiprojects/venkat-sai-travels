import { createFileRoute } from '@tanstack/react-router'
import Admin, { AdminSection } from '../../pages/Admin'

export const Route = createFileRoute('/admin/$section')({
  component: AdminSectionComponent,
})

function AdminSectionComponent() {
  const { section } = Route.useParams()
  return <Admin initialSection={section as AdminSection} />
}
