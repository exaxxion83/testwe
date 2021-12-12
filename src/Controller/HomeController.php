<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use App\Form\Type\SearchFormType;
use Symfony\Component\Security\Core\Security;
use App\Entity\Type;
use App\Entity\People;


class HomeController extends AbstractController
{
    /**
     * @var ManagerRegistry
     */
    private $doctrine;
    /**
     * @var Security
     */
    private $security;

    public function __construct(ManagerRegistry $doctrine, Security $security)
    {
        $this->security = $security;
        $this->doctrine = $doctrine;
    }

    /**
     * @Route("/", name="home")
     */
    public function index()
    {
        $searchForm = $this->getSearchForm();
        $user = $this->security->getUser();

        return $this->render(
            'Home/index.html.twig',
            [
                'form' => $searchForm->createView(),
                'user' => $user
            ]
        );
    }

    /**
     * @return \Symfony\Component\Form\FormInterface
     */
    private function getSearchForm(): FormInterface
    {
        $form = $this->createForm(
            SearchFormType::class,
            [
                'action' => $this->generateUrl('api_movies_get_collection'),
                'typeList' => $this->getTypeList(),
                'actorList' => $this->getActorList()
            ]
        );

        return $form;
    }

    private function getTypeList(): Array
    {
        $repositoryType = $this->doctrine->getRepository(Type::class);
        return $repositoryType->findAllOnlyName();
    }

    private function getActorList(): Array
    {
        $repositoryActor = $this->doctrine->getRepository(People::class);
        return $repositoryActor->findAllOnlyName();
    }


}